import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";
import {
    handleRouteError,
    parsePagination,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ dishName: string }>;
}

export const runtime = "nodejs";

// GET /api/food/dish/:dishName
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { dishName } = await context.params;
        const { searchParams } = new URL(req.url);
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const [spots, total] = await Promise.all([
            FoodSpot.find({ dishCategory: dishName })
                .sort({ upvotes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-upvotedBy -beenHereBy")
                .lean(),
            FoodSpot.countDocuments({ dishCategory: dishName }),
        ]);

        return respondOk({
            spots,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleRouteError("GET /api/food/dish/:dishName", error);
    }
}
