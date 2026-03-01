import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
    cleanString,
    handleRouteError,
    parseInteger,
    respondError,
    respondOk,
} from "@/lib/api-helpers";
import { userUpsertSchema } from "@/lib/validation";

export const runtime = "nodejs";

function toUsernameBase(input: string): string {
    const normalized = input
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 24);

    return normalized || "user";
}

async function ensureUniqueUsername(base: string, currentUserId?: string) {
    const root = toUsernameBase(base);
    let candidate = root;
    let attempt = 1;

    while (true) {
        const existing = await User.findOne({ username: candidate })
            .select("_id")
            .lean();

        if (!existing || String(existing._id) === currentUserId) {
            return candidate;
        }

        attempt += 1;
        candidate = `${root}_${attempt}`.slice(0, 40);
    }
}

// GET /api/users
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const uid = cleanString(searchParams.get("uid"));
        const username = cleanString(searchParams.get("username"))?.toLowerCase();
        const leaderboard = searchParams.get("leaderboard") === "true";
        const limit = parseInteger(searchParams.get("limit"), 10, 1, 100);

        if (uid) {
            const user = await User.findOne({ firebaseUid: uid }).lean();
            if (!user) return respondError("User not found", 404);
            return respondOk({ user });
        }

        if (username) {
            const user = await User.findOne({ username }).lean();
            if (!user) return respondError("User not found", 404);
            return respondOk({ user });
        }

        if (leaderboard) {
            const users = await User.find()
                .sort({ karmaPoints: -1 })
                .limit(limit)
                .select("name username avatarUrl karmaPoints postsCount totalUpvotes badges rank")
                .lean();
            return respondOk({ users });
        }

        return respondError("Provide uid, username, or leaderboard=true", 400);
    } catch (error) {
        return handleRouteError("GET /api/users", error);
    }
}

// POST /api/users
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await req.json();
        const parsed = userUpsertSchema.safeParse(payload);

        if (!parsed.success) {
            return respondError("Invalid user payload", 400, parsed.error.flatten());
        }

        const data = parsed.data;
        const existingUser = await User.findOne({ firebaseUid: data.firebaseUid });

        if (existingUser) {
            const nextUsername = await ensureUniqueUsername(
                data.username ?? existingUser.username,
                String(existingUser._id)
            );

            const updated = await User.findOneAndUpdate(
                { firebaseUid: data.firebaseUid },
                {
                    $set: {
                        name: data.name,
                        email: data.email,
                        avatarUrl: data.avatarUrl ?? existingUser.avatarUrl,
                        username: nextUsername,
                    },
                },
                { new: true }
            ).lean();

            return respondOk({ user: updated });
        }

        const usernameSeed = data.username ?? data.email.split("@")[0] ?? data.name;
        const username = await ensureUniqueUsername(usernameSeed);

        const user = await User.create({
            ...data,
            username,
            avatarUrl: data.avatarUrl ?? "",
        });

        return respondOk({ user }, 201);
    } catch (error) {
        return handleRouteError("POST /api/users", error);
    }
}
