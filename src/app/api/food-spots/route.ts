import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";
import {
    cleanString,
    handleRouteError,
    parseFloatNumber,
    parsePagination,
    respondError,
    respondOk,
} from "@/lib/api-helpers";
import { foodSpotCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

const FOOD_SORTS: Record<string, Record<string, 1 | -1>> = {
    popular: { upvotes: -1, createdAt: -1 },
    rating: { rating: -1, totalRatings: -1 },
    newest: { createdAt: -1 },
};

// GET /api/food-spots
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const dish = cleanString(searchParams.get("dish"));
        const area = cleanString(searchParams.get("area"));
        const city = cleanString(searchParams.get("city"));
        const spotType = cleanString(searchParams.get("spotType"));
        const sort = cleanString(searchParams.get("sort")) ?? "popular";
        const search = cleanString(searchParams.get("search"));
        const lat = parseFloatNumber(searchParams.get("lat"), Number.NaN, -90, 90);
        const lng = parseFloatNumber(searchParams.get("lng"), Number.NaN, -180, 180);
        const radiusKm = parseFloatNumber(searchParams.get("radius"), 5, 0.2, 50);
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const query: Record<string, unknown> = {};

        if (dish && dish !== "All") query.dishCategory = dish;
        if (area && area !== "All") query.area = area;
        if (city && city !== "All") query.city = city;
        if (spotType && spotType !== "All") query.spotType = spotType;
        if (search) query.$text = { $search: search };

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            query.location = {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: radiusKm * 1000,
                },
            };
        }

        const sortQuery = FOOD_SORTS[sort] ?? FOOD_SORTS.popular;

        const [spots, total] = await Promise.all([
            FoodSpot.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
                .select("-upvotedBy -beenHereBy")
                .lean(),
            FoodSpot.countDocuments(query),
        ]);

        return respondOk(
            {
                spots,
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
        return handleRouteError("GET /api/food-spots", error);
    }
}

// POST /api/food-spots
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await req.json();
        const parsed = foodSpotCreateSchema.safeParse(payload);

        if (!parsed.success) {
            return respondError("Invalid food spot payload", 400, parsed.error.flatten());
        }

        const data = parsed.data;

        const spot = await FoodSpot.create({
            ...data,
            tags: data.tags ?? [],
            dishTags: data.dishTags ?? [],
            photos: data.photos ?? [],
            rating: data.rating ?? 0,
        });

        return respondOk({ spot }, 201);
    } catch (error) {
        return handleRouteError("POST /api/food-spots", error);
    }
}
