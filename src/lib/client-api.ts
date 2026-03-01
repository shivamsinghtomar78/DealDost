import type { AppUser, Deal, Event, FoodSpot } from "@/lib/types";
import { mapDealDoc, mapEventDoc, mapFoodSpotDoc } from "@/lib/transformers";

interface FetchOptions {
    signal?: AbortSignal;
}

interface DealQuery extends FetchOptions {
    platform?: string;
    category?: string;
    sort?: string;
    search?: string;
    expiringSoon?: boolean;
    limit?: number;
    page?: number;
}

interface FoodSpotQuery extends FetchOptions {
    dish?: string;
    area?: string;
    city?: string;
    spotType?: string;
    sort?: string;
    search?: string;
    limit?: number;
    page?: number;
}

interface EventQuery extends FetchOptions {
    type?: string;
    area?: string;
    city?: string;
    search?: string;
    limit?: number;
    page?: number;
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(errorBody || `Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
}

function withQuery(path: string, params: Record<string, string | number | boolean | undefined>) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === "") return;
        searchParams.set(key, String(value));
    });
    const query = searchParams.toString();
    return query ? `${path}?${query}` : path;
}

export async function fetchDeals(query: DealQuery = {}): Promise<Deal[]> {
    const url = withQuery("/api/deals", {
        platform: query.platform,
        category: query.category,
        sort: query.sort,
        search: query.search,
        expiringSoon: query.expiringSoon,
        limit: query.limit ?? 60,
        page: query.page ?? 1,
    });

    const json = await requestJson<{ deals?: Record<string, unknown>[] }>(url, query.signal);
    return (json.deals ?? []).map((deal) => mapDealDoc(deal));
}

export async function fetchDealById(id: string, signal?: AbortSignal): Promise<Deal | null> {
    const json = await requestJson<{ deal?: Record<string, unknown> }>(`/api/deals/${id}`, signal);
    if (!json.deal) return null;
    return mapDealDoc(json.deal);
}

export async function fetchFoodSpots(query: FoodSpotQuery = {}): Promise<FoodSpot[]> {
    const url = withQuery("/api/food-spots", {
        dish: query.dish,
        area: query.area,
        city: query.city,
        spotType: query.spotType,
        sort: query.sort,
        search: query.search,
        limit: query.limit ?? 60,
        page: query.page ?? 1,
    });

    const json = await requestJson<{ spots?: Record<string, unknown>[] }>(url, query.signal);
    return (json.spots ?? []).map((spot) => mapFoodSpotDoc(spot));
}

export async function fetchFoodSpotById(id: string, signal?: AbortSignal): Promise<FoodSpot | null> {
    const json = await requestJson<{ spot?: Record<string, unknown> }>(`/api/food-spots/${id}`, signal);
    if (!json.spot) return null;
    return mapFoodSpotDoc(json.spot);
}

export async function fetchEvents(query: EventQuery = {}): Promise<Event[]> {
    const url = withQuery("/api/events", {
        type: query.type,
        area: query.area,
        city: query.city,
        search: query.search,
        limit: query.limit ?? 60,
        page: query.page ?? 1,
    });

    const json = await requestJson<{ events?: Record<string, unknown>[] }>(url, query.signal);
    return (json.events ?? []).map((event) => mapEventDoc(event));
}

function normalizeUser(raw: Record<string, unknown>): AppUser {
    return {
        id: String(raw._id ?? ""),
        firebaseUid: String(raw.firebaseUid ?? ""),
        name: String(raw.name ?? ""),
        username: String(raw.username ?? ""),
        email: String(raw.email ?? ""),
        avatarUrl: String(raw.avatarUrl ?? ""),
        city: String(raw.city ?? ""),
        area: String(raw.area ?? ""),
        postsCount: Number(raw.postsCount ?? 0),
        totalUpvotes: Number(raw.totalUpvotes ?? 0),
        totalSaved: Number(raw.totalSaved ?? 0),
        savedDeals: Array.isArray(raw.savedDeals) ? raw.savedDeals.map(String) : [],
        savedFoodSpots: Array.isArray(raw.savedFoodSpots) ? raw.savedFoodSpots.map(String) : [],
        badges: Array.isArray(raw.badges) ? raw.badges.map(String) : [],
        karmaPoints: Number(raw.karmaPoints ?? 0),
    };
}

export async function fetchUserByUid(uid: string, signal?: AbortSignal): Promise<AppUser | null> {
    const json = await requestJson<{ user?: Record<string, unknown> }>(
        `/api/users?uid=${encodeURIComponent(uid)}`,
        signal
    );
    if (!json.user) return null;
    return normalizeUser(json.user);
}

export async function fetchUserByUsername(username: string, signal?: AbortSignal): Promise<AppUser | null> {
    const json = await requestJson<{ user?: Record<string, unknown> }>(
        `/api/users?username=${encodeURIComponent(username)}`,
        signal
    );
    if (!json.user) return null;
    return normalizeUser(json.user);
}

export async function fetchLeaderboard(limit = 20, signal?: AbortSignal): Promise<AppUser[]> {
    const json = await requestJson<{ users?: Record<string, unknown>[] }>(
        `/api/leaderboard?limit=${limit}`,
        signal
    );

    return (json.users ?? []).map(normalizeUser);
}
