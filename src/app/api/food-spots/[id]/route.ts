import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import FoodSpot from "@/models/FoodSpot";
import {
    handleRouteError,
    isValidObjectId,
    respondError,
    respondOk,
} from "@/lib/api-helpers";
import { foodSpotActionSchema, foodSpotUpdateSchema } from "@/lib/validation";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

// GET /api/food-spots/[id]
export async function GET(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return respondError("Invalid food spot id", 400);
        }

        const spot = await FoodSpot.findById(id)
            .select("-upvotedBy -beenHereBy")
            .lean();

        if (!spot) {
            return respondError("Food spot not found", 404);
        }

        return respondOk({ spot }, 200, "s-maxage=30, stale-while-revalidate=120");
    } catch (error) {
        return handleRouteError("GET /api/food-spots/[id]", error);
    }
}

// PUT /api/food-spots/[id]
export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return respondError("Invalid food spot id", 400);
        }

        const body = await req.json();
        const hasAction =
            typeof body === "object" &&
            body !== null &&
            "action" in body;

        if (hasAction) {
            const parsedAction = foodSpotActionSchema.safeParse(body);
            if (!parsedAction.success) {
                return respondError("Invalid action payload", 400, parsedAction.error.flatten());
            }

            const { action, userId } = parsedAction.data;

            if (action === "upvote") {
                const spot = await FoodSpot.findOneAndUpdate(
                    { _id: id },
                    [
                        { $set: { _alreadyUpvoted: { $in: [userId, "$upvotedBy"] } } },
                        {
                            $set: {
                                upvotedBy: {
                                    $cond: [
                                        "$_alreadyUpvoted",
                                        { $setDifference: ["$upvotedBy", [userId]] },
                                        { $setUnion: ["$upvotedBy", [userId]] },
                                    ],
                                },
                                upvotes: {
                                    $cond: [
                                        "$_alreadyUpvoted",
                                        { $max: [{ $subtract: ["$upvotes", 1] }, 0] },
                                        { $add: ["$upvotes", 1] },
                                    ],
                                },
                            },
                        },
                        { $unset: "_alreadyUpvoted" },
                    ],
                    { new: true }
                )
                    .select("-upvotedBy -beenHereBy")
                    .lean();

                if (!spot) {
                    return respondError("Food spot not found", 404);
                }

                return respondOk({ spot });
            }

            const spot = await FoodSpot.findOneAndUpdate(
                { _id: id },
                [
                    { $set: { _alreadyBeenHere: { $in: [userId, "$beenHereBy"] } } },
                    {
                        $set: {
                            beenHereBy: {
                                $cond: [
                                    "$_alreadyBeenHere",
                                    { $setDifference: ["$beenHereBy", [userId]] },
                                    { $setUnion: ["$beenHereBy", [userId]] },
                                ],
                            },
                            beenHereCount: {
                                $cond: [
                                    "$_alreadyBeenHere",
                                    { $max: [{ $subtract: ["$beenHereCount", 1] }, 0] },
                                    { $add: ["$beenHereCount", 1] },
                                ],
                            },
                        },
                    },
                    { $unset: "_alreadyBeenHere" },
                ],
                { new: true }
            )
                .select("-upvotedBy -beenHereBy")
                .lean();

            if (!spot) {
                return respondError("Food spot not found", 404);
            }

            return respondOk({ spot });
        }

        const parsedUpdate = foodSpotUpdateSchema.safeParse(body);
        if (!parsedUpdate.success) {
            return respondError("Invalid food spot update payload", 400, parsedUpdate.error.flatten());
        }

        const updateData = parsedUpdate.data;

        if (Object.keys(updateData).length === 0) {
            return respondError("No update fields provided", 400);
        }

        if (updateData.priceRange && updateData.priceRange.max < updateData.priceRange.min) {
            return respondError("priceRange.max must be greater than or equal to priceRange.min", 400);
        }

        const spot = await FoodSpot.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        )
            .select("-upvotedBy -beenHereBy")
            .lean();

        if (!spot) {
            return respondError("Food spot not found", 404);
        }

        return respondOk({ spot });
    } catch (error) {
        return handleRouteError("PUT /api/food-spots/[id]", error);
    }
}

// DELETE /api/food-spots/[id]
export async function DELETE(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return respondError("Invalid food spot id", 400);
        }

        const deleted = await FoodSpot.findByIdAndDelete(id).lean();
        if (!deleted) {
            return respondError("Food spot not found", 404);
        }

        return respondOk({ message: "Food spot deleted" });
    } catch (error) {
        return handleRouteError("DELETE /api/food-spots/[id]", error);
    }
}
