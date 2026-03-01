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

function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/posts/:id
export async function GET(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!isValidObjectId(id)) return respondError("Invalid post id", 400);

        const post = await Post.findById(id).lean();
        if (!post) return respondError("Post not found", 404);

        return respondOk({ post });
    } catch (error) {
        return handleRouteError("GET /api/posts/:id", error);
    }
}

// PUT /api/posts/:id
export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!isValidObjectId(id)) return respondError("Invalid post id", 400);

        const payload = (await req.json()) as Record<string, unknown>;
        const allowedFields = [
            "title",
            "description",
            "images",
            "tags",
            "status",
            "dealData",
            "foodData",
            "location",
        ];

        const updateData: Record<string, unknown> = {};
        for (const key of allowedFields) {
            if (key in payload) {
                updateData[key] = payload[key];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return respondError("No update fields provided", 400);
        }

        const post = await Post.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!post) return respondError("Post not found", 404);
        return respondOk({ post });
    } catch (error) {
        return handleRouteError("PUT /api/posts/:id", error);
    }
}

// DELETE /api/posts/:id
export async function DELETE(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!isValidObjectId(id)) return respondError("Invalid post id", 400);

        const post = await Post.findByIdAndDelete(id).lean();
        if (!post) return respondError("Post not found", 404);

        return respondOk({ message: "Post deleted" });
    } catch (error) {
        return handleRouteError("DELETE /api/posts/:id", error);
    }
}
