import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";
import {
    cleanString,
    handleRouteError,
    parseBoolean,
    parsePagination,
    respondError,
    respondOk,
} from "@/lib/api-helpers";
import { dealCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

const DEAL_SORTS: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    hot: { upvotes: -1, createdAt: -1 },
    expiring: { expiresAt: 1 },
    discount: { discountPercent: -1, createdAt: -1 },
};

// GET /api/deals
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const platform = cleanString(searchParams.get("platform"));
        const category = cleanString(searchParams.get("category"));
        const sort = cleanString(searchParams.get("sort")) ?? "newest";
        const search = cleanString(searchParams.get("search"));
        const expiringSoon = parseBoolean(searchParams.get("expiringSoon"));
        const { page, limit, skip } = parsePagination(searchParams, {
            defaultLimit: 12,
            maxLimit: 60,
        });

        const query: Record<string, unknown> = {
            isActive: true,
            expiresAt: { $gt: new Date() },
        };

        if (platform && platform !== "All") query.platform = platform;
        if (category && category !== "All") query.category = category;
        if (search) query.$text = { $search: search };
        if (expiringSoon) {
            const sixHoursFromNow = new Date(Date.now() + 6 * 60 * 60 * 1000);
            query.expiresAt = { $gte: new Date(), $lte: sixHoursFromNow };
        }

        const sortQuery = DEAL_SORTS[sort] ?? DEAL_SORTS.newest;

        const [deals, total] = await Promise.all([
            Deal.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
                .select("-upvotedBy -verifiedBy")
                .lean(),
            Deal.countDocuments(query),
        ]);

        return respondOk(
            {
                deals,
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
        return handleRouteError("GET /api/deals", error);
    }
}

// POST /api/deals
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await req.json();
        const parsed = dealCreateSchema.safeParse(payload);

        if (!parsed.success) {
            return respondError("Invalid deal payload", 400, parsed.error.flatten());
        }

        const data = parsed.data;
        const discountPercent =
            data.originalPrice > 0
                ? Math.round(((data.originalPrice - data.dealPrice) / data.originalPrice) * 100)
                : 0;

        const deal = await Deal.create({
            ...data,
            discountPercent,
            tags: data.tags ?? [],
        });

        return respondOk({ deal }, 201);
    } catch (error) {
        return handleRouteError("POST /api/deals", error);
    }
}
