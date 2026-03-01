import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";

// GET /api/food-spots — List with filters + geo
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const dish = searchParams.get("dish");
        const area = searchParams.get("area");
        const city = searchParams.get("city");
        const spotType = searchParams.get("spotType");
        const sort = searchParams.get("sort") || "popular";
        const search = searchParams.get("search");
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");
        const radius = parseFloat(searchParams.get("radius") || "5"); // km
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        const query: Record<string, unknown> = {};

        if (dish && dish !== "All") query.dishCategory = dish;
        if (area) query.area = area;
        if (city) query.city = city;
        if (spotType) query.spotType = spotType;
        if (search) query.$text = { $search: search };

        // Geo "Near Me" query
        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: radius * 1000, // Convert km to meters
                },
            };
        }

        let sortQuery: Record<string, 1 | -1> = {};
        switch (sort) {
            case "rating":
                sortQuery = { rating: -1 };
                break;
            case "newest":
                sortQuery = { createdAt: -1 };
                break;
            default:
                sortQuery = { upvotes: -1 };
        }

        const skip = (page - 1) * limit;
        const [spots, total] = await Promise.all([
            FoodSpot.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
            FoodSpot.countDocuments(query),
        ]);

        return NextResponse.json({
            spots,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("GET /api/food-spots error:", error);
        return NextResponse.json({ error: "Failed to fetch food spots" }, { status: 500 });
    }
}

// POST /api/food-spots
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const spot = await FoodSpot.create(body);
        return NextResponse.json({ spot }, { status: 201 });
    } catch (error) {
        console.error("POST /api/food-spots error:", error);
        return NextResponse.json({ error: "Failed to create food spot" }, { status: 500 });
    }
}
