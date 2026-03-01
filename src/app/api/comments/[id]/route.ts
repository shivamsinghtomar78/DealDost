import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import {
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

// DELETE /api/comments/:id
export async function DELETE(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid comment id", 400);

        const comment = await Comment.findByIdAndDelete(id).lean();
        if (!comment) return respondError("Comment not found", 404);

        await Post.findByIdAndUpdate(comment.postId, {
            $inc: { commentsCount: -1 },
        });

        return respondOk({ message: "Comment deleted" });
    } catch (error) {
        return handleRouteError("DELETE /api/comments/:id", error);
    }
}
