import { NextRequest } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

const registerSchema = z.object({
    firebaseUid: z.string().trim().min(1),
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email(),
    avatarUrl: z.string().url().optional(),
    city: z.string().trim().optional(),
    area: z.string().trim().optional(),
    username: z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9_]+$/)
        .max(40)
        .optional(),
});

// POST /api/auth/register
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await req.json();
        const parsed = registerSchema.safeParse(payload);
        if (!parsed.success) return respondError("Invalid payload", 400, parsed.error.flatten());
        const data = parsed.data;

        const existing = await User.findOne({ firebaseUid: data.firebaseUid }).lean();
        if (existing) return respondError("User already exists", 409);

        const baseUsername = data.username ?? data.email.split("@")[0] ?? data.name.toLowerCase().replace(/\s+/g, "_");
        const user = await User.create({
            firebaseUid: data.firebaseUid,
            name: data.name,
            username: baseUsername,
            email: data.email,
            avatarUrl: data.avatarUrl ?? "",
            city: data.city ?? "",
            area: data.area ?? "",
        });

        return respondOk({ user }, 201);
    } catch (error) {
        return handleRouteError("POST /api/auth/register", error);
    }
}
