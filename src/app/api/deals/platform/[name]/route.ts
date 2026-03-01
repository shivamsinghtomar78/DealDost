import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";
import {
    handleRouteError,
    parsePagination,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ name: string }>;
}

export const runtime = "nodejs";

// GET /api/deals/platform/:name
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { name } = await context.params;
        const { searchParams } = new URL(req.url);
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const [deals, total] = await Promise.all([
            Deal.find({
                isActive: true,
                platform: name,
                expiresAt: { $gt: new Date() },
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-upvotedBy -verifiedBy")
                .lean(),
            Deal.countDocuments({
                isActive: true,
                platform: name,
                expiresAt: { $gt: new Date() },
            }),
        ]);

        return respondOk({
            deals,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleRouteError("GET /api/deals/platform/:name", error);
    }
}
