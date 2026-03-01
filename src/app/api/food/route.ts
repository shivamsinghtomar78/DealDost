import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";
import {
    cleanString,
    handleRouteError,
    parsePagination,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/food
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const dish = cleanString(searchParams.get("dish"));
        const area = cleanString(searchParams.get("area"));
        const city = cleanString(searchParams.get("city"));
        const sort = cleanString(searchParams.get("sort")) ?? "popular";
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const query: Record<string, unknown> = {};
        if (dish && dish !== "All") query.dishCategory = dish;
        if (area && area !== "All") query.area = area;
        if (city && city !== "All") query.city = city;

        const sortQuery: Record<string, 1 | -1> = sort === "rating"
            ? { rating: -1, totalRatings: -1 }
            : sort === "newest"
                ? { createdAt: -1 }
                : { upvotes: -1, createdAt: -1 };

        const [spots, total] = await Promise.all([
            FoodSpot.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
                .select("-upvotedBy -beenHereBy")
                .lean(),
            FoodSpot.countDocuments(query),
        ]);

        return respondOk({
            spots,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleRouteError("GET /api/food", error);
    }
}
