import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";
import {
    handleRouteError,
    parseInteger,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/deals/expiring
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const hours = parseInteger(searchParams.get("hours"), 2, 1, 24);
        const limit = parseInteger(searchParams.get("limit"), 20, 1, 100);
        const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);

        const deals = await Deal.find({
            isActive: true,
            expiresAt: { $gte: new Date(), $lte: endTime },
        })
            .sort({ expiresAt: 1 })
            .limit(limit)
            .select("-upvotedBy -verifiedBy")
            .lean();

        return respondOk({ deals, windowHours: hours });
    } catch (error) {
        return handleRouteError("GET /api/deals/expiring", error);
    }
}
