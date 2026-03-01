import { NextRequest } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import {
    cleanString,
    handleRouteError,
    parsePagination,
    respondError,
    respondOk,
} from "@/lib/api-helpers";
import mongoose from "mongoose";

export const runtime = "nodejs";

const createPostSchema = z.object({
    type: z.enum(["deal", "food_spot", "event", "lost_found", "service", "alert"]),
    userId: z.string().min(1),
    title: z.string().trim().min(3).max(200),
    description: z.string().trim().max(4000).optional(),
    images: z.array(z.string().url()).max(10).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
    dealData: z
        .object({
            platform: z.string().trim().min(1),
            platformType: z.enum(["ecommerce", "quick_commerce"]),
            originalPrice: z.number().nonnegative(),
            dealPrice: z.number().nonnegative(),
            discountPercent: z.number().min(0).max(100).optional(),
            dealLink: z.string().url(),
            category: z.string().trim().min(1),
            expiresAt: z.coerce.date(),
        })
        .optional(),
    foodData: z
        .object({
            placeName: z.string().trim().min(1),
            dishName: z.string().trim().min(1),
            dishCategory: z.string().trim().min(1),
            priceRange: z.string().trim().min(1),
            timing: z.string().trim().min(1),
            isStreetStall: z.boolean().optional(),
            landmark: z.string().trim().optional(),
            averageRating: z.number().min(0).max(5).optional(),
            ratingsCount: z.number().int().nonnegative().optional(),
        })
        .optional(),
    location: z
        .object({
            city: z.string().trim().min(1),
            area: z.string().trim().min(1),
            fullAddress: z.string().trim().optional(),
            coordinates: z.object({
                lat: z.number().min(-90).max(90),
                lng: z.number().min(-180).max(180),
            }),
        })
        .optional(),
});

async function resolveUserObjectId(inputUserId: string): Promise<mongoose.Types.ObjectId | null> {
    if (mongoose.Types.ObjectId.isValid(inputUserId)) {
        return new mongoose.Types.ObjectId(inputUserId);
    }

    const user = await User.findOne({ firebaseUid: inputUserId }).select("_id").lean();
    if (!user?._id) return null;

    return new mongoose.Types.ObjectId(String(user._id));
}

// GET /api/posts
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);

        const type = cleanString(searchParams.get("type"));
        const city = cleanString(searchParams.get("city"));
        const area = cleanString(searchParams.get("area"));
        const platform = cleanString(searchParams.get("platform"));
        const status = cleanString(searchParams.get("status")) ?? "active";
        const search = cleanString(searchParams.get("search"));
        const sort = cleanString(searchParams.get("sort")) ?? "newest";
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const query: Record<string, unknown> = { status };
        if (type && type !== "all") query.type = type;
        if (city) query["location.city"] = city;
        if (area) query["location.area"] = area;
        if (platform) query["dealData.platform"] = platform;
        if (search) query.$text = { $search: search };

        let sortQuery: Record<string, 1 | -1>;
        switch (sort) {
            case "upvotes":
            case "hot":
                sortQuery = { upvotes: -1, createdAt: -1 };
                break;
            default:
                sortQuery = { createdAt: -1 };
        }

        const [posts, total] = await Promise.all([
            Post.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
            Post.countDocuments(query),
        ]);

        return respondOk({
            posts,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleRouteError("GET /api/posts", error);
    }
}

// POST /api/posts
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await req.json();
        const parsed = createPostSchema.safeParse(payload);

        if (!parsed.success) {
            return respondError("Invalid post payload", 400, parsed.error.flatten());
        }

        const data = parsed.data;
        const resolvedUserId = await resolveUserObjectId(data.userId);
        if (!resolvedUserId) return respondError("Invalid userId", 400);

        if (data.type === "deal" && !data.dealData) {
            return respondError("dealData is required for deal posts", 400);
        }

        if (data.type === "food_spot" && !data.foodData) {
            return respondError("foodData is required for food spot posts", 400);
        }

        const discountPercent =
            data.dealData && data.dealData.originalPrice > 0
                ? Math.round(
                    ((data.dealData.originalPrice - data.dealData.dealPrice) /
                        data.dealData.originalPrice) *
                    100
                )
                : undefined;

        const post = await Post.create({
            ...data,
            userId: resolvedUserId,
            description: data.description ?? "",
            images: data.images ?? [],
            tags: data.tags ?? [],
            dealData: data.dealData
                ? {
                    ...data.dealData,
                    discountPercent: data.dealData.discountPercent ?? discountPercent ?? 0,
                    communityVerified: false,
                    verifiedCount: 0,
                }
                : undefined,
            foodData: data.foodData
                ? {
                    ...data.foodData,
                    isStreetStall: data.foodData.isStreetStall ?? false,
                    landmark: data.foodData.landmark ?? "",
                    averageRating: data.foodData.averageRating ?? 0,
                    ratingsCount: data.foodData.ratingsCount ?? 0,
                }
                : undefined,
            location: data.location
                ? {
                    ...data.location,
                    fullAddress: data.location.fullAddress ?? "",
                }
                : undefined,
        });

        return respondOk({ post }, 201);
    } catch (error) {
        return handleRouteError("POST /api/posts", error);
    }
}
