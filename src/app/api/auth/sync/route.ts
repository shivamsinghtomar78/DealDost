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

const syncSchema = z.object({
    firebaseUid: z.string().trim().min(1),
    email: z.string().trim().email().optional(),
    name: z.string().trim().optional(),
    avatarUrl: z.string().url().optional(),
});

// POST /api/auth/sync
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await req.json();
        const parsed = syncSchema.safeParse(payload);
        if (!parsed.success) return respondError("Invalid payload", 400, parsed.error.flatten());

        const data = parsed.data;
        const user = await User.findOneAndUpdate(
            { firebaseUid: data.firebaseUid },
            {
                $set: {
                    ...(data.name ? { name: data.name } : {}),
                    ...(data.email ? { email: data.email } : {}),
                    ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
                },
                $setOnInsert: {
                    firebaseUid: data.firebaseUid,
                    name: data.name ?? "DealDost User",
                    email: data.email ?? `${data.firebaseUid}@example.com`,
                    username: (data.email?.split("@")[0] ?? data.firebaseUid).slice(0, 40),
                },
            },
            { upsert: true, new: true }
        ).lean();

        return respondOk({ user });
    } catch (error) {
        return handleRouteError("POST /api/auth/sync", error);
    }
}
