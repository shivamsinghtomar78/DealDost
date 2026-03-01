import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import {
    cleanString,
    handleRouteError,
    parsePagination,
    respondError,
    respondOk,
} from "@/lib/api-helpers";
import { eventCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

// GET /api/events
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const eventType = cleanString(searchParams.get("type"));
        const area = cleanString(searchParams.get("area"));
        const city = cleanString(searchParams.get("city"));
        const search = cleanString(searchParams.get("search"));
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const query: Record<string, unknown> = {};
        if (eventType && eventType !== "all") query.eventType = eventType;
        if (area && area !== "All") query.area = area;
        if (city && city !== "All") query.city = city;
        if (search) query.$text = { $search: search };

        const [events, total] = await Promise.all([
            Event.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-upvotedBy -interestedBy")
                .lean(),
            Event.countDocuments(query),
        ]);

        return respondOk(
            {
                events,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
            200,
            "s-maxage=30, stale-while-revalidate=120"
        );
    } catch (error) {
        return handleRouteError("GET /api/events", error);
    }
}

// POST /api/events
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await req.json();
        const parsed = eventCreateSchema.safeParse(payload);

        if (!parsed.success) {
            return respondError("Invalid event payload", 400, parsed.error.flatten());
        }

        const data = parsed.data;

        const event = await Event.create({
            ...data,
            entryFee: data.entryFee ?? "Free",
            tags: data.tags ?? [],
        });

        return respondOk({ event }, 201);
    } catch (error) {
        return handleRouteError("POST /api/events", error);
    }
}
