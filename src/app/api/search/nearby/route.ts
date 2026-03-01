import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";
import Post from "@/models/Post";
import {
    cleanString,
    handleRouteError,
    parseFloatNumber,
    parseInteger,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/search/nearby?lat=&lng=&radius=&type=
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const lat = parseFloatNumber(searchParams.get("lat"), Number.NaN, -90, 90);
        const lng = parseFloatNumber(searchParams.get("lng"), Number.NaN, -180, 180);
        const radiusKm = parseFloatNumber(searchParams.get("radius"), 5, 0.2, 50);
        const type = cleanString(searchParams.get("type")) ?? "all";
        const city = cleanString(searchParams.get("city"));
        const limit = parseInteger(searchParams.get("limit"), 20, 1, 100);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return respondError("lat and lng are required", 400);
        }

        if (type === "food_spot" || type === "all") {
            const spots = await FoodSpot.find({
                ...(city ? { city } : {}),
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [lng, lat] },
                        $maxDistance: radiusKm * 1000,
                    },
                },
            })
                .limit(limit)
                .lean();

            return respondOk({ type: "food_spot", results: spots });
        }

        const posts = await Post.find({
            status: "active",
            ...(type !== "all" ? { type } : {}),
            ...(city ? { "location.city": city } : {}),
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return respondOk({
            type: type === "all" ? "posts" : type,
            results: posts,
            note: "Geo radius filtering is currently available for food spots via Mongo geospatial index.",
        });
    } catch (error) {
        return handleRouteError("GET /api/search/nearby", error);
    }
}
