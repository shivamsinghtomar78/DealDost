import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

// GET /api/events
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const eventType = searchParams.get("type");
        const area = searchParams.get("area");
        const city = searchParams.get("city");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        const query: Record<string, unknown> = {};
        if (eventType && eventType !== "all") query.eventType = eventType;
        if (area) query.area = area;
        if (city) query.city = city;
        if (search) query.$text = { $search: search };

        const skip = (page - 1) * limit;
        const [events, total] = await Promise.all([
            Event.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Event.countDocuments(query),
        ]);

        return NextResponse.json({
            events,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("GET /api/events error:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

// POST /api/events
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const event = await Event.create(body);
        return NextResponse.json({ event }, { status: 201 });
    } catch (error) {
        console.error("POST /api/events error:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
