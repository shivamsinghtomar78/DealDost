import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users — Leaderboard or search users
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid");
        const username = searchParams.get("username");
        const leaderboard = searchParams.get("leaderboard") === "true";
        const limit = parseInt(searchParams.get("limit") || "10");

        if (uid) {
            const user = await User.findOne({ firebaseUid: uid }).lean();
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
            return NextResponse.json({ user });
        }

        if (username) {
            const user = await User.findOne({ username }).lean();
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
            return NextResponse.json({ user });
        }

        if (leaderboard) {
            const users = await User.find()
                .sort({ karmaPoints: -1 })
                .limit(limit)
                .select("name username avatarUrl karmaPoints postsCount totalUpvotes badges rank")
                .lean();
            return NextResponse.json({ users });
        }

        return NextResponse.json({ error: "Provide uid, username, or leaderboard=true" }, { status: 400 });
    } catch (error) {
        console.error("GET /api/users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// POST /api/users — Create or update user profile (called after Firebase auth)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const existingUser = await User.findOne({ firebaseUid: body.firebaseUid });

        if (existingUser) {
            // Update existing user
            const updated = await User.findOneAndUpdate(
                { firebaseUid: body.firebaseUid },
                { $set: { name: body.name, email: body.email, avatarUrl: body.avatarUrl } },
                { new: true }
            ).lean();
            return NextResponse.json({ user: updated });
        }

        // Create new user
        const user = await User.create({
            ...body,
            username: body.username || body.email.split("@")[0],
        });
        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        console.error("POST /api/users error:", error);
        return NextResponse.json({ error: "Failed to create/update user" }, { status: 500 });
    }
}
