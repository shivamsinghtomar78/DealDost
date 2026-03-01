import { NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import {
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

const bodySchema = z.object({
    userId: z.string().trim().min(1),
});

export const runtime = "nodejs";

// POST /api/posts/:id/upvote
export async function POST(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid post id", 400);

        const payload = await req.json();
        const parsed = bodySchema.safeParse(payload);
        if (!parsed.success) return respondError("Invalid payload", 400, parsed.error.flatten());
        const { userId } = parsed.data;

        const post = await Post.findOneAndUpdate(
            { _id: id },
            [
                { $set: { _alreadyUpvoted: { $in: [userId, "$upvotedBy"] } } },
                {
                    $set: {
                        upvotedBy: {
                            $cond: [
                                "$_alreadyUpvoted",
                                { $setDifference: ["$upvotedBy", [userId]] },
                                { $setUnion: ["$upvotedBy", [userId]] },
                            ],
                        },
                        upvotes: {
                            $cond: [
                                "$_alreadyUpvoted",
                                { $max: [{ $subtract: ["$upvotes", 1] }, 0] },
                                { $add: ["$upvotes", 1] },
                            ],
                        },
                    },
                },
                { $unset: "_alreadyUpvoted" },
            ],
            { new: true }
        ).lean();

        if (!post) return respondError("Post not found", 404);
        return respondOk({ post });
    } catch (error) {
        return handleRouteError("POST /api/posts/:id/upvote", error);
    }
}
