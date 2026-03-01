"use client";

import { useState } from "react";
import { MOCK_FOOD_SPOTS, DISH_CATEGORIES } from "@/lib/mock-data";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, List, Map, SlidersHorizontal } from "lucide-react";

const AREAS = ["All", "North Campus", "Karol Bagh", "Chandni Chowk", "Saket", "Hauz Khas", "Connaught Place", "Lajpat Nagar", "Pitampura"];
const PRICE_RANGES = ["All", "Under ₹50", "₹50-₹150", "₹150-₹300", "₹300+"];
const SPOT_TYPES = ["All", "Street Stall", "Restaurant", "Cafe", "Dhaba"];

export default function FoodPage() {
    const [view, setView] = useState<"list" | "map">("list");
    const [dish, setDish] = useState("All");
    const [area, setArea] = useState("All");
    const [priceRange, setPriceRange] = useState("All");

    const filtered = MOCK_FOOD_SPOTS.filter((spot) => {
        if (dish !== "All" && spot.dishName !== dish) return false;
        if (area !== "All" && spot.area !== area) return false;
        return true;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <UtensilsCrossed className="w-6 h-6 text-orange-500" />
                        <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                            Food Spots
                        </h1>
                    </div>
                    <p className="text-sm text-text-secondary">Discover the best local food recommended by your community</p>
                </div>

                {/* View Toggle */}
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

            {/* Dish Category Slider */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                {DISH_CATEGORIES.map((cat) => (
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

            {/* Filters Row */}
            <div className="flex items-center gap-2 flex-wrap">
                <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#1e2028] border border-border dark:border-[#2a2d34] outline-none cursor-pointer"
                >
                    {AREAS.map((a) => (
                        <option key={a} value={a}>📍 {a}</option>
                    ))}
                </select>
                <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#1e2028] border border-border dark:border-[#2a2d34] outline-none cursor-pointer"
                >
                    {PRICE_RANGES.map((p) => (
                        <option key={p} value={p}>💰 {p}</option>
                    ))}
                </select>
                <select className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#1e2028] border border-border dark:border-[#2a2d34] outline-none cursor-pointer">
                    {SPOT_TYPES.map((t) => (
                        <option key={t} value={t}>🏪 {t}</option>
                    ))}
                </select>
            </div>

            {/* Map View Placeholder */}
            {view === "map" ? (
                <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-border dark:border-[#2a2d34] p-8 text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-white">Map View Coming Soon</h3>
                    <p className="text-sm text-text-secondary mt-1">Google Maps integration with dish-category color coded markers</p>
                    <p className="text-xs text-text-muted mt-2">Requires Google Maps API key to activate</p>
                </div>
            ) : (
                <>
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4">🍜</div>
                            <p className="text-lg font-bold text-text-primary dark:text-white">No food spots found</p>
                            <p className="text-sm text-text-secondary mt-1">Try changing your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((spot) => (
                                <FoodSpotCard key={spot.id} spot={spot} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
