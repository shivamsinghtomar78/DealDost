import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";
import {
    handleRouteError,
    isValidObjectId,
    respondError,
    respondOk,
} from "@/lib/api-helpers";
import { dealActionSchema, dealUpdateSchema } from "@/lib/validation";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

// GET /api/deals/[id]
export async function GET(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return respondError("Invalid deal id", 400);
        }

        const deal = await Deal.findById(id)
            .select("-upvotedBy -verifiedBy")
            .lean();

        if (!deal) {
            return respondError("Deal not found", 404);
        }

        return respondOk({ deal }, 200, "s-maxage=30, stale-while-revalidate=120");
    } catch (error) {
        return handleRouteError("GET /api/deals/[id]", error);
    }
}

// PUT /api/deals/[id]
export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return respondError("Invalid deal id", 400);
        }

        const body = await req.json();
        const hasAction =
            typeof body === "object" &&
            body !== null &&
            "action" in body;

        if (hasAction) {
            const parsedAction = dealActionSchema.safeParse(body);
            if (!parsedAction.success) {
                return respondError("Invalid action payload", 400, parsedAction.error.flatten());
            }

            const { action, userId } = parsedAction.data;

            if (action === "upvote") {
                const deal = await Deal.findOneAndUpdate(
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
                    .select("-upvotedBy -verifiedBy")
                    .lean();

                if (!deal) {
                    return respondError("Deal not found", 404);
                }

                return respondOk({ deal });
            }

            const deal = await Deal.findOneAndUpdate(
                { _id: id },
                [
                    { $set: { _alreadyVerified: { $in: [userId, "$verifiedBy"] } } },
                    {
                        $set: {
                            verifiedBy: {
                                $setUnion: ["$verifiedBy", [userId]],
                            },
                            verifiedCount: {
                                $cond: [
                                    "$_alreadyVerified",
                                    "$verifiedCount",
                                    { $add: ["$verifiedCount", 1] },
                                ],
                            },
                        },
                    },
                    { $unset: "_alreadyVerified" },
                ],
                { new: true }
            )
                .select("-upvotedBy -verifiedBy")
                .lean();

            if (!deal) {
                return respondError("Deal not found", 404);
            }

            return respondOk({ deal });
        }

        const parsedUpdate = dealUpdateSchema.safeParse(body);
        if (!parsedUpdate.success) {
            return respondError("Invalid deal update payload", 400, parsedUpdate.error.flatten());
        }

        const updateData = parsedUpdate.data;

        if (Object.keys(updateData).length === 0) {
            return respondError("No update fields provided", 400);
        }

        const updatePayload: Record<string, unknown> = { ...updateData };

        if (
            updateData.originalPrice !== undefined ||
            updateData.dealPrice !== undefined
        ) {
            const current = await Deal.findById(id)
                .select("originalPrice dealPrice")
                .lean();

            if (!current) {
                return respondError("Deal not found", 404);
            }

            const originalPrice = updateData.originalPrice ?? current.originalPrice;
            const dealPrice = updateData.dealPrice ?? current.dealPrice;

            if (dealPrice > originalPrice) {
                return respondError("Deal price must be less than or equal to original price", 400);
            }

            updatePayload.discountPercent =
                originalPrice > 0
                    ? Math.round(((originalPrice - dealPrice) / originalPrice) * 100)
                    : 0;
        }

        const deal = await Deal.findByIdAndUpdate(
            id,
            { $set: updatePayload },
            {
                new: true,
                runValidators: true,
            }
        )
            .select("-upvotedBy -verifiedBy")
            .lean();

        if (!deal) {
            return respondError("Deal not found", 404);
        }

        return respondOk({ deal });
    } catch (error) {
        return handleRouteError("PUT /api/deals/[id]", error);
    }
}

// DELETE /api/deals/[id]
export async function DELETE(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return respondError("Invalid deal id", 400);
        }

        const deleted = await Deal.findByIdAndDelete(id).lean();
        if (!deleted) {
            return respondError("Deal not found", 404);
        }

        return respondOk({ message: "Deal deleted" });
    } catch (error) {
        return handleRouteError("DELETE /api/deals/[id]", error);
    }
}
