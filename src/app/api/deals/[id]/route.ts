import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET /api/deals/[id]
export async function GET(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        const deal = await Deal.findById(id).lean();

        if (!deal) {
            return NextResponse.json({ error: "Deal not found" }, { status: 404 });
        }

        return NextResponse.json({ deal });
    } catch (error) {
        console.error("GET /api/deals/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch deal" }, { status: 500 });
    }
}

// PUT /api/deals/[id] — Update (upvote, verify, edit)
export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { action, userId } = body;

        let update: Record<string, unknown> = {};

        if (action === "upvote") {
            const deal = await Deal.findById(id);
            if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

            if (deal.upvotedBy.includes(userId)) {
                // Remove upvote
                update = { $inc: { upvotes: -1 }, $pull: { upvotedBy: userId } };
            } else {
                // Add upvote
                update = { $inc: { upvotes: 1 }, $addToSet: { upvotedBy: userId } };
            }
        } else if (action === "verify") {
            update = { $inc: { verifiedCount: 1 }, $addToSet: { verifiedBy: userId } };
        } else {
            // General update
            update = body;
        }

        const deal = await Deal.findByIdAndUpdate(id, update, { new: true }).lean();
        return NextResponse.json({ deal });
    } catch (error) {
        console.error("PUT /api/deals/[id] error:", error);
        return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
    }
}

// DELETE /api/deals/[id]
export async function DELETE(_req: NextRequest, context: RouteContext) {
    try {
        await connectDB();
        const { id } = await context.params;
        await Deal.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deal deleted" });
    } catch (error) {
        console.error("DELETE /api/deals/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
    }
}
