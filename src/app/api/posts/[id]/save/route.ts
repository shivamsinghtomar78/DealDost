import { NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
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

// POST /api/posts/:id/save
export async function POST(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid post id", 400);

        const payload = await req.json();
        const parsed = bodySchema.safeParse(payload);
        if (!parsed.success) return respondError("Invalid payload", 400, parsed.error.flatten());
        const { userId } = parsed.data;

        const [post, user] = await Promise.all([
            Post.findById(id),
            User.findOne({ firebaseUid: userId }),
        ]);

        if (!post) return respondError("Post not found", 404);
        if (!user) return respondError("User not found", 404);

        const postId = post._id.toString();
        let currentlySaved = false;

        if (post.type === "deal") {
            currentlySaved = user.savedDeals.includes(postId);
            user.savedDeals = currentlySaved
                ? user.savedDeals.filter((savedId) => savedId !== postId)
                : [...user.savedDeals, postId];
        } else if (post.type === "food_spot") {
            currentlySaved = user.savedFoodSpots.includes(postId);
            user.savedFoodSpots = currentlySaved
                ? user.savedFoodSpots.filter((savedId) => savedId !== postId)
                : [...user.savedFoodSpots, postId];
        }

        post.savesCount = currentlySaved
            ? Math.max(post.savesCount - 1, 0)
            : post.savesCount + 1;

        await Promise.all([post.save(), user.save()]);

        return respondOk({
            saved: !currentlySaved,
            savesCount: post.savesCount,
            postId,
        });
    } catch (error) {
        return handleRouteError("POST /api/posts/:id/save", error);
    }
}
