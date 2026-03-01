import { NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";
import {
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

const bodySchema = z.object({
    rating: z.number().min(1).max(5),
    taste: z.number().min(0).max(5).optional(),
    portion: z.number().min(0).max(5).optional(),
    value: z.number().min(0).max(5).optional(),
    hygiene: z.number().min(0).max(5).optional(),
});

export const runtime = "nodejs";

// POST /api/food/:id/review
export async function POST(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid food spot id", 400);

        const payload = await req.json();
        const parsed = bodySchema.safeParse(payload);
        if (!parsed.success) return respondError("Invalid payload", 400, parsed.error.flatten());

        const spot = await FoodSpot.findById(id);
        if (!spot) return respondError("Food spot not found", 404);

        const totalRatings = spot.totalRatings + 1;
        spot.rating = Number(((spot.rating * spot.totalRatings + parsed.data.rating) / totalRatings).toFixed(2));
        spot.totalRatings = totalRatings;

        if (parsed.data.taste !== undefined) spot.ratingBreakdown.taste = parsed.data.taste;
        if (parsed.data.portion !== undefined) spot.ratingBreakdown.portion = parsed.data.portion;
        if (parsed.data.value !== undefined) spot.ratingBreakdown.value = parsed.data.value;
        if (parsed.data.hygiene !== undefined) spot.ratingBreakdown.hygiene = parsed.data.hygiene;

        await spot.save();

        return respondOk({ spot });
    } catch (error) {
        return handleRouteError("POST /api/food/:id/review", error);
    }
}
