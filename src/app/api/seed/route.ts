import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";
import FoodSpot from "@/models/FoodSpot";
import Event from "@/models/Event";
import User from "@/models/User";
import { handleRouteError, respondError, respondOk } from "@/lib/api-helpers";

export const runtime = "nodejs";

interface SeedPayload {
    user?: Record<string, unknown>;
    deals?: Record<string, unknown>[];
    foodSpots?: Record<string, unknown>[];
    events?: Record<string, unknown>[];
}

// POST /api/seed
// Secure by SEED_SECRET and explicit payload; no hardcoded dummy records.
export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");
        const seedSecret = process.env.SEED_SECRET;

        if (!seedSecret) {
            return respondError("SEED_SECRET is not configured on the server", 503);
        }

        if (secret !== seedSecret) {
            return respondError("Unauthorized", 401);
        }

        await connectDB();

        const body = (await req.json().catch(() => ({}))) as SeedPayload;
        const seedUser = body.user;
        const deals = body.deals ?? [];
        const foodSpots = body.foodSpots ?? [];
        const events = body.events ?? [];

        let resolvedUser = null;

        if (seedUser?.firebaseUid && seedUser?.email && seedUser?.name) {
            resolvedUser = await User.findOneAndUpdate(
                { firebaseUid: String(seedUser.firebaseUid) },
                {
                    $set: {
                        name: String(seedUser.name),
                        email: String(seedUser.email),
                        username: String(seedUser.username ?? String(seedUser.email).split("@")[0]),
                        area: String(seedUser.area ?? ""),
                        city: String(seedUser.city ?? ""),
                        avatarUrl: String(seedUser.avatarUrl ?? ""),
                    },
                },
                { upsert: true, new: true }
            );
        }

        for (const entry of deals) {
            await Deal.findOneAndUpdate(
                { title: String(entry.title) },
                {
                    $set: {
                        ...entry,
                        postedBy: String(entry.postedBy ?? resolvedUser?.firebaseUid ?? "seed_user"),
                        postedByUsername: String(entry.postedByUsername ?? resolvedUser?.username ?? "seed_user"),
                    },
                },
                { upsert: true, new: true, runValidators: true }
            );
        }

        for (const entry of foodSpots) {
            await FoodSpot.findOneAndUpdate(
                { name: String(entry.name) },
                {
                    $set: {
                        ...entry,
                        postedBy: String(entry.postedBy ?? resolvedUser?.firebaseUid ?? "seed_user"),
                        postedByUsername: String(entry.postedByUsername ?? resolvedUser?.username ?? "seed_user"),
                    },
                },
                { upsert: true, new: true, runValidators: true }
            );
        }

        for (const entry of events) {
            await Event.findOneAndUpdate(
                { title: String(entry.title) },
                {
                    $set: {
                        ...entry,
                        postedBy: String(entry.postedBy ?? resolvedUser?.firebaseUid ?? "seed_user"),
                        postedByUsername: String(entry.postedByUsername ?? resolvedUser?.username ?? "seed_user"),
                    },
                },
                { upsert: true, new: true, runValidators: true }
            );
        }

        const counts = await Promise.all([
            Deal.countDocuments(),
            FoodSpot.countDocuments(),
            Event.countDocuments(),
            User.countDocuments(),
        ]);

        return respondOk({
            message: "Seed import completed",
            inserted: {
                deals: deals.length,
                foodSpots: foodSpots.length,
                events: events.length,
                user: resolvedUser ? 1 : 0,
            },
            counts: { deals: counts[0], foodSpots: counts[1], events: counts[2], users: counts[3] },
        });
    } catch (error) {
        return handleRouteError("POST /api/seed", error);
    }
}
