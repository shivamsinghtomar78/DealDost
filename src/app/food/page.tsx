"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FOOD_DISH_CATEGORIES } from "@/lib/constants";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, List, Map, Search, ArrowRight } from "lucide-react";
import { fetchFoodSpots } from "@/lib/client-api";
import type { FoodSpot } from "@/lib/types";

const AREAS = ["All", "North Campus", "Karol Bagh", "Chandni Chowk", "Saket", "Hauz Khas", "Connaught Place", "Lajpat Nagar", "Pitampura"];
const PRICE_RANGES = ["All", "Under Rs 50", "Rs 50-150", "Rs 150-300", "Rs 300+"];
const SPOT_TYPES = ["All", "street_stall", "restaurant", "cafe", "dhaba", "cloud_kitchen"];

function isInSelectedPriceRange(priceRange: string, selected: string): boolean {
    if (selected === "All") return true;

    const cleaned = priceRange.replace(/[^0-9-]/g, "");
    const [minRaw, maxRaw] = cleaned.split("-");
    const min = Number.parseInt(minRaw || "0", 10);
    const max = Number.parseInt(maxRaw || String(min), 10);

    if (selected === "Under Rs 50") return max < 50;
    if (selected === "Rs 50-150") return min >= 50 && max <= 150;
    if (selected === "Rs 150-300") return min >= 150 && max <= 300;
    if (selected === "Rs 300+") return min >= 300;

    return true;
}

export default function FoodPage() {
    const [view, setView] = useState<"list" | "map">("list");
    const [dish, setDish] = useState("All");
    const [area, setArea] = useState("All");
    const [priceRange, setPriceRange] = useState("All");
    const [spotType, setSpotType] = useState("All");
    const [search, setSearch] = useState("");

    const [spots, setSpots] = useState<FoodSpot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadSpots = async () => {
            setLoading(true);
            setError(null);

            const data = await fetchFoodSpots({
                dish,
                area,
                spotType,
                search: search.trim() || undefined,
                sort: "popular",
                limit: 60,
                signal: controller.signal,
            });

            if (!active) return;

            setSpots(data);
            setLoading(false);
        };

        loadSpots().catch((fetchError) => {
            if (!active) return;
            const message = fetchError instanceof Error ? fetchError.message : "Failed to load food spots";
            setError(message);
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [dish, area, spotType, search]);

    const filtered = useMemo(() => {
        return spots.filter((spot) => isInSelectedPriceRange(spot.priceRange, priceRange));
    }, [spots, priceRange]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <UtensilsCrossed className="w-6 h-6 text-orange-500" />
                        <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                            Food Spots
                        </h1>
                    </div>
                    <p className="text-sm text-text-secondary">Discover local food picks from your community</p>
                </div>

                <div className="flex items-center bg-gray-100 dark:bg-[#2a2d34] rounded-xl p-1">
                    <button
                        onClick={() => setView("list")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                            view === "list" ? "bg-white dark:bg-[#1e2028] text-primary shadow-sm" : "text-text-muted"
                        )}
                    >
                        <List className="w-4 h-4" />
                        List
                    </button>
                    <button
                        onClick={() => setView("map")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                            view === "map" ? "bg-white dark:bg-[#1e2028] text-primary shadow-sm" : "text-text-muted"
                        )}
                    >
                        <Map className="w-4 h-4" />
                        Map
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by dish, place, or area"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                {FOOD_DISH_CATEGORIES.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setDish(cat.name)}
                        className={cn(
                            "shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all border",
                            dish === cat.name
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                : "bg-white dark:bg-[#1e2028] text-text-secondary border-border dark:border-[#2a2d34] hover:border-primary/50 hover:text-primary"
                        )}
                    >
                        <span className="text-base">{cat.emoji}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#1e2028] border border-border dark:border-[#2a2d34] outline-none cursor-pointer"
                >
                    {AREAS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#1e2028] border border-border dark:border-[#2a2d34] outline-none cursor-pointer"
                >
                    {PRICE_RANGES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                <select
                    value={spotType}
                    onChange={(e) => setSpotType(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#1e2028] border border-border dark:border-[#2a2d34] outline-none cursor-pointer"
                >
                    {SPOT_TYPES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            {view === "map" ? (
                <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-border dark:border-[#2a2d34] p-6 sm:p-8 text-center space-y-3">
                    <h3 className="text-lg font-bold text-text-primary dark:text-white">Explore Full Interactive Food Map</h3>
                    <p className="text-sm text-text-secondary">
                        Switch to map mode with location markers and quick navigation to each spot.
                    </p>
                    <Link
                        href="/food/map"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary"
                    >
                        Open Food Map
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-80 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-lg font-bold text-text-primary dark:text-white">No food spots found</p>
                    <p className="text-sm text-text-secondary mt-1">Try changing your filters or search query</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((spot) => (
                        <FoodSpotCard key={spot.id} spot={spot} />
                    ))}
                </div>
            )}
        </div>
    );
}
