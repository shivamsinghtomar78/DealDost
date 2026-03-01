import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

// GET /api/users/:id
export async function GET(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid user id", 400);

        const user = await User.findById(id).lean();
        if (!user) return respondError("User not found", 404);

        return respondOk({ user });
    } catch (error) {
        return handleRouteError("GET /api/users/:id", error);
    }
}

// PUT /api/users/:id
export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid user id", 400);

        const payload = (await req.json()) as Record<string, unknown>;
        const allowedFields = ["name", "avatarUrl", "area", "city", "badges"];
        const updateData: Record<string, unknown> = {};

        for (const key of allowedFields) {
            if (key in payload) updateData[key] = payload[key];
        }

        if (Object.keys(updateData).length === 0) return respondError("No update fields provided", 400);

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!user) return respondError("User not found", 404);
        return respondOk({ user });
    } catch (error) {
        return handleRouteError("PUT /api/users/:id", error);
    }
}
