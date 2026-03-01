import type { Deal, Event, FoodSpot } from "@/lib/mock-data";

type UnknownDoc = Record<string, unknown>;

function asId(value: unknown, fallback = ""): string {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "toString" in value) {
        return String(value);
    }
    return fallback;
}

function asString(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item)).filter(Boolean);
}

function toDateString(value: unknown): string {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    return new Date().toISOString();
}

export function mapDealDoc(doc: UnknownDoc): Deal {
    const originalPrice = asNumber(doc.originalPrice, 0);
    const dealPrice = asNumber(doc.dealPrice, 0);
    const discountPercent =
        asNumber(doc.discountPercent, -1) >= 0
            ? asNumber(doc.discountPercent, 0)
            : originalPrice > 0
                ? Math.round(((originalPrice - dealPrice) / originalPrice) * 100)
                : 0;

    return {
        id: asId(doc._id ?? doc.id),
        type: "deal",
        title: asString(doc.title, "Untitled deal"),
        description: asString(doc.description, ""),
        platform: asString(doc.platform, "Other"),
        platformType:
            asString(doc.platformType, "ecommerce") === "quick_commerce"
                ? "quick_commerce"
                : "ecommerce",
        originalPrice,
        dealPrice,
        discountPercent,
        dealLink: asString(doc.dealLink, "#"),
        image: asString(doc.imageUrl ?? doc.image, "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop"),
        category: asString(doc.category, "Other"),
        expiresAt: toDateString(doc.expiresAt),
        upvotes: asNumber(doc.upvotes, 0),
        savesCount: asNumber(doc.savesCount, 0),
        commentsCount: asNumber(doc.commentsCount, 0),
        verified: asNumber(doc.verifiedCount, 0) > 0,
        verifiedCount: asNumber(doc.verifiedCount, 0),
        postedBy: {
            name: asString(doc.postedByName ?? doc.postedByUsername ?? "DealDost User"),
            username: asString(doc.postedByUsername ?? "dealdost"),
            avatar: asString(doc.postedByAvatar ?? ""),
        },
        createdAt: toDateString(doc.createdAt),
        tags: asStringArray(doc.tags),
    };
}

export function mapFoodSpotDoc(doc: UnknownDoc): FoodSpot {
    const priceRange = doc.priceRange as { min?: number; max?: number } | undefined;
    const minPrice = asNumber(priceRange?.min, 0);
    const maxPrice = asNumber(priceRange?.max, minPrice);
    const location = doc.location as { coordinates?: [number, number] } | undefined;
    const coordinates = location?.coordinates ?? [0, 0];
    const lat = asNumber(coordinates[1], 0);
    const lng = asNumber(coordinates[0], 0);
    const dishCategory = asString(doc.dishCategory, "Other");
    const dishTags = asStringArray(doc.dishTags);

    return {
        id: asId(doc._id ?? doc.id),
        type: "food_spot",
        placeName: asString(doc.name ?? doc.placeName, "Unknown food spot"),
        dishName: asString(dishTags[0] ?? dishCategory, "Dish"),
        dishCategory,
        description: asString(doc.description, ""),
        priceRange: `Rs ${minPrice}-${maxPrice}`,
        timing: asString(doc.timing, "Open hours unavailable"),
        image: asString(doc.imageUrl ?? doc.image, "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400&h=300&fit=crop"),
        area: asString(doc.area, "Unknown area"),
        city: asString(doc.city, "Unknown city"),
        landmark: asString(doc.landmark, ""),
        isStreetStall: asString(doc.spotType, "street_stall") === "street_stall",
        averageRating: asNumber(doc.rating, 0),
        ratingsCount: asNumber(doc.totalRatings, 0),
        beenHereCount: asNumber(doc.beenHereCount, 0),
        upvotes: asNumber(doc.upvotes, 0),
        savesCount: asNumber(doc.savesCount, 0),
        tags: asStringArray(doc.tags),
        postedBy: {
            name: asString(doc.postedByName ?? doc.postedByUsername ?? "DealDost User"),
            username: asString(doc.postedByUsername ?? "dealdost"),
            avatar: asString(doc.postedByAvatar ?? ""),
        },
        createdAt: toDateString(doc.createdAt),
        coordinates: { lat, lng },
    };
}

export function mapEventDoc(doc: UnknownDoc): Event {
    const date = asString(doc.date);
    const time = asString(doc.time);

    return {
        id: asId(doc._id ?? doc.id),
        type: (asString(doc.eventType, "event") as Event["type"]) ?? "event",
        title: asString(doc.title, "Untitled event"),
        description: asString(doc.description, ""),
        image: asString(doc.imageUrl ?? doc.image, "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop"),
        eventType: asString(doc.eventType, "event"),
        dateTime: date && time ? `${date} - ${time}` : asString(doc.dateTime, "Date/time TBA"),
        venue: asString(doc.venue, "Venue TBA"),
        entryFee: asString(doc.entryFee, "Free"),
        organizer: asString(doc.organizer, ""),
        interestedCount: asNumber(doc.interestedCount, 0),
        area: asString(doc.area, ""),
        city: asString(doc.city, ""),
        upvotes: asNumber(doc.upvotes, 0),
        postedBy: {
            name: asString(doc.postedByName ?? doc.postedByUsername ?? "DealDost User"),
            username: asString(doc.postedByUsername ?? "dealdost"),
            avatar: asString(doc.postedByAvatar ?? ""),
        },
        createdAt: toDateString(doc.createdAt),
    };
}
