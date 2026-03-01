import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Deal from "@/models/Deal";
import FoodSpot from "@/models/FoodSpot";
import {
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

// GET /api/users/:id/saved
export async function GET(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return respondError("Invalid user id", 400);

        const user = await User.findById(id).lean();
        if (!user) return respondError("User not found", 404);

        const [deals, foodSpots] = await Promise.all([
            Deal.find({ _id: { $in: user.savedDeals } }).lean(),
            FoodSpot.find({ _id: { $in: user.savedFoodSpots } }).lean(),
        ]);

        return respondOk({ deals, foodSpots });
    } catch (error) {
        return handleRouteError("GET /api/users/:id/saved", error);
    }
}
