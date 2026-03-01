import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";
import {
    cleanString,
    handleRouteError,
    parseFloatNumber,
    parseInteger,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/food/nearby?lat=&lng=&radius=
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const lat = parseFloatNumber(searchParams.get("lat"), Number.NaN, -90, 90);
        const lng = parseFloatNumber(searchParams.get("lng"), Number.NaN, -180, 180);
        const radiusKm = parseFloatNumber(searchParams.get("radius"), 5, 0.2, 50);
        const city = cleanString(searchParams.get("city"));
        const limit = parseInteger(searchParams.get("limit"), 20, 1, 100);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return respondError("lat and lng are required", 400);
        }

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
            .select("-upvotedBy -beenHereBy")
            .lean();

        return respondOk({ spots, radiusKm });
    } catch (error) {
        return handleRouteError("GET /api/food/nearby", error);
    }
}
