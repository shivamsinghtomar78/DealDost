import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";
import {
    handleRouteError,
    parseInteger,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/deals/trending
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const limit = parseInteger(searchParams.get("limit"), 5, 1, 50);

        const deals = await Deal.find({
            isActive: true,
            expiresAt: { $gt: new Date() },
        })
            .sort({ upvotes: -1, createdAt: -1 })
            .limit(limit)
            .select("-upvotedBy -verifiedBy")
            .lean();

        return respondOk({ deals });
    } catch (error) {
        return handleRouteError("GET /api/deals/trending", error);
    }
}
