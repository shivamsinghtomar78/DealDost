import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
    handleRouteError,
    parseInteger,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/leaderboard
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const limit = parseInteger(searchParams.get("limit"), 10, 1, 100);

        const users = await User.find()
            .sort({ karmaPoints: -1, totalUpvotes: -1 })
            .limit(limit)
            .select("name username avatarUrl karmaPoints postsCount totalUpvotes badges rank")
            .lean();

        return respondOk({ users });
    } catch (error) {
        return handleRouteError("GET /api/leaderboard", error);
    }
}
