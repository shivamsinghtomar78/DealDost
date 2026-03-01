import { NextRequest } from "next/server";
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

export const runtime = "nodejs";

// POST /api/posts/:id/verify
export async function POST(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid post id", 400);

        const post = await Post.findById(id);
        if (!post) return respondError("Post not found", 404);
        if (post.type !== "deal") return respondError("Only deal posts can be verified", 400);

        post.dealData = {
            platform: post.dealData?.platform ?? "",
            platformType: post.dealData?.platformType ?? "ecommerce",
            originalPrice: post.dealData?.originalPrice ?? 0,
            dealPrice: post.dealData?.dealPrice ?? 0,
            discountPercent: post.dealData?.discountPercent ?? 0,
            dealLink: post.dealData?.dealLink ?? "",
            category: post.dealData?.category ?? "",
            expiresAt: post.dealData?.expiresAt ?? new Date(),
            communityVerified: true,
            verifiedCount: (post.dealData?.verifiedCount ?? 0) + 1,
        };

        await post.save();
        return respondOk({ post });
    } catch (error) {
        return handleRouteError("POST /api/posts/:id/verify", error);
    }
}
