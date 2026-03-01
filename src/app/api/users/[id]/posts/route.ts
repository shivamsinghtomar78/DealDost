import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import {
    handleRouteError,
    parsePagination,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

// GET /api/users/:id/posts
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid user id", 400);

        const { searchParams } = new URL(req.url);
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const [posts, total] = await Promise.all([
            Post.find({ userId: id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Post.countDocuments({ userId: id }),
        ]);

        return respondOk({
            posts,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleRouteError("GET /api/users/:id/posts", error);
    }
}
