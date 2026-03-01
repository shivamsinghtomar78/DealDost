import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";

// GET /api/deals — List deals with filters
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const platform = searchParams.get("platform");
        const category = searchParams.get("category");
        const sort = searchParams.get("sort") || "newest";
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const expiringSoon = searchParams.get("expiringSoon") === "true";

        // Build query
        const query: Record<string, unknown> = { isActive: true };

        if (platform && platform !== "All") query.platform = platform;
        if (category && category !== "All") query.category = category;
        if (search) query.$text = { $search: search };
        if (expiringSoon) {
            const sixHoursFromNow = new Date(Date.now() + 6 * 60 * 60 * 1000);
            query.expiresAt = { $lte: sixHoursFromNow, $gte: new Date() };
        }

        // Build sort
        let sortQuery: Record<string, 1 | -1> = {};
        switch (sort) {
            case "hot":
                sortQuery = { upvotes: -1 };
                break;
            case "expiring":
                sortQuery = { expiresAt: 1 };
                break;
            case "discount":
                sortQuery = { discountPercent: -1 };
                break;
            default:
                sortQuery = { createdAt: -1 };
        }

        const skip = (page - 1) * limit;
        const [deals, total] = await Promise.all([
            Deal.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
            Deal.countDocuments(query),
        ]);

        return NextResponse.json({
            deals,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("GET /api/deals error:", error);
        return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
    }
}

// POST /api/deals — Create a new deal
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Calculate discount
        if (body.originalPrice && body.dealPrice) {
            body.discountPercent = Math.round(
                ((body.originalPrice - body.dealPrice) / body.originalPrice) * 100
            );
        }

        const deal = await Deal.create(body);
        return NextResponse.json({ deal }, { status: 201 });
    } catch (error) {
        console.error("POST /api/deals error:", error);
        return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
    }
}
