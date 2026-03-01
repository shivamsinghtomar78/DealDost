import { NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import User from "@/models/User";
import {
    handleRouteError,
    parsePagination,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

const createCommentSchema = z.object({
    userId: z.string().trim().min(1),
    text: z.string().trim().min(1).max(1200),
    parentCommentId: z.string().trim().optional(),
});

export const runtime = "nodejs";

async function resolveUserObjectId(inputUserId: string): Promise<mongoose.Types.ObjectId | null> {
    if (mongoose.Types.ObjectId.isValid(inputUserId)) {
        return new mongoose.Types.ObjectId(inputUserId);
    }

    const user = await User.findOne({ firebaseUid: inputUserId }).select("_id").lean();
    if (!user?._id) return null;

    return new mongoose.Types.ObjectId(String(user._id));
}

// GET /api/posts/:id/comments
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid post id", 400);

        const { searchParams } = new URL(req.url);
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 20,
            maxLimit: 100,
        });

        const [comments, total] = await Promise.all([
            Comment.find({ postId: id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Comment.countDocuments({ postId: id }),
        ]);

        return respondOk({
            comments,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleRouteError("GET /api/posts/:id/comments", error);
    }
}

// POST /api/posts/:id/comments
export async function POST(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid post id", 400);

        const payload = await req.json();
        const parsed = createCommentSchema.safeParse(payload);
        if (!parsed.success) return respondError("Invalid payload", 400, parsed.error.flatten());

        const post = await Post.findById(id);
        if (!post) return respondError("Post not found", 404);

        const parentCommentId = parsed.data.parentCommentId;
        if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
            return respondError("Invalid parentCommentId", 400);
        }

        const resolvedUserId = await resolveUserObjectId(parsed.data.userId);
        if (!resolvedUserId) return respondError("Invalid userId", 400);

        const comment = await Comment.create({
            postId: new mongoose.Types.ObjectId(id),
            userId: resolvedUserId,
            parentCommentId: parentCommentId ? new mongoose.Types.ObjectId(parentCommentId) : null,
            text: parsed.data.text,
        });

        post.commentsCount += 1;
        await post.save();

        return respondOk({ comment }, 201);
    } catch (error) {
        return handleRouteError("POST /api/posts/:id/comments", error);
    }
}
