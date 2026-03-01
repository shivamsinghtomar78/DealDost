import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
    cleanString,
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET /api/auth/me
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const headerUid = cleanString(req.headers.get("x-firebase-uid"));
        const { searchParams } = new URL(req.url);
        const uid = headerUid ?? cleanString(searchParams.get("uid"));

        if (!uid) {
            return respondError("Missing firebase uid (x-firebase-uid header or uid query param)", 400);
        }

        const user = await User.findOne({ firebaseUid: uid }).lean();
        if (!user) return respondError("User not found", 404);

        return respondOk({ user });
    } catch (error) {
        return handleRouteError("GET /api/auth/me", error);
    }
}
