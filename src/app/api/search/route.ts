import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import {
    cleanString,
    handleRouteError,
    parsePagination,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/search?q=&city=&type=
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const queryText = cleanString(searchParams.get("q"));
        const city = cleanString(searchParams.get("city"));
        const type = cleanString(searchParams.get("type"));
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 20,
            maxLimit: 100,
        });

        if (!queryText) {
            return respondError("q parameter is required", 400);
        }

        const query: Record<string, unknown> = {
            status: "active",
            $text: { $search: queryText },
        };
        if (city) query["location.city"] = city;
        if (type && type !== "all") query.type = type;

        const [results, total] = await Promise.all([
            Post.find(query)
                .sort({ score: { $meta: "textScore" }, createdAt: -1 })
                .select({ score: { $meta: "textScore" } })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(query),
        ]);

        return respondOk({
            results,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleRouteError("GET /api/search", error);
    }
}
