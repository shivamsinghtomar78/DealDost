import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET /api/food-spots/[id]
export async function GET(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        const spot = await FoodSpot.findById(id).lean();

        if (!spot) {
            return NextResponse.json({ error: "Food spot not found" }, { status: 404 });
        }

        return NextResponse.json({ spot });
    } catch (error) {
        console.error("GET /api/food-spots/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch food spot" }, { status: 500 });
    }
}

// PUT /api/food-spots/[id] — Upvote, rate, been-here
export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { action, userId } = body;

        let update: Record<string, unknown> = {};

        if (action === "upvote") {
            const spot = await FoodSpot.findById(id);
            if (!spot) return NextResponse.json({ error: "Not found" }, { status: 404 });

            if (spot.upvotedBy.includes(userId)) {
                update = { $inc: { upvotes: -1 }, $pull: { upvotedBy: userId } };
            } else {
                update = { $inc: { upvotes: 1 }, $addToSet: { upvotedBy: userId } };
            }
        } else if (action === "been_here") {
            update = { $inc: { beenHereCount: 1 }, $addToSet: { beenHereBy: userId } };
        } else {
            update = body;
        }

        const spot = await FoodSpot.findByIdAndUpdate(id, update, { new: true }).lean();
        return NextResponse.json({ spot });
    } catch (error) {
        console.error("PUT /api/food-spots/[id] error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

// DELETE /api/food-spots/[id]
export async function DELETE(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        await FoodSpot.findByIdAndDelete(id);
        return NextResponse.json({ message: "Food spot deleted" });
    } catch (error) {
        console.error("DELETE /api/food-spots/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
