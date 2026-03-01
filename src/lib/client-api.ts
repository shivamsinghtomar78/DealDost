import { MOCK_DEALS, MOCK_EVENTS, MOCK_FOOD_SPOTS, type Deal, type Event, type FoodSpot } from "@/lib/mock-data";
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

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T | null> {
    try {
        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            signal,
        });

        if (!response.ok) {
            return null;
        }

        const json = (await response.json()) as T;
        return json;
    } catch {
        return null;
    }
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
    if (!json) return MOCK_DEALS;
    return (json.deals ?? []).map((deal) => mapDealDoc(deal));
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
    if (!json) return MOCK_FOOD_SPOTS;
    return (json.spots ?? []).map((spot) => mapFoodSpotDoc(spot));
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
    if (!json) return MOCK_EVENTS;
    return (json.events ?? []).map((event) => mapEventDoc(event));
}
