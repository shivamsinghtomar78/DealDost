"use client";

import { MOCK_FOOD_SPOTS } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Filter, List, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

const GeoapifyMap = dynamic(() => import("@/components/maps/GeoapifyMap"), { ssr: false });

export default function FoodMapPage() {
    const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
    const [view, setView] = useState<"map" | "split">("split");

    const allMarkers = MOCK_FOOD_SPOTS.map((spot) => ({
        lat: spot.coordinates.lat,
        lng: spot.coordinates.lng,
        title: spot.placeName,
        description: `${spot.dishCategory} • ${spot.priceRange} • ⭐ ${spot.averageRating}`,
        emoji: spot.dishCategory === "Street Snacks" ? "🥟" : spot.dishCategory === "Heavy Meals" ? "🍛" : spot.dishCategory === "Non-Veg" ? "🍗" : spot.dishCategory === "Cafe & Drinks" ? "☕" : "🍽️",
    }));

    // Delhi center
    const center = { lat: 28.6500, lng: 77.2100 };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)]">
                        🗺️ Food Map — Delhi
                    </h1>
                    <p className="text-text-muted text-sm mt-1">
                        Discover {MOCK_FOOD_SPOTS.length} food spots near you
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView("split")}
                        className={`p-2.5 rounded-xl border transition-colors ${view === "split" ? "bg-primary text-white border-primary" : "bg-white dark:bg-[#1e2028] text-text-secondary border-border dark:border-[#2a2d34]"}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView("map")}
                        className={`p-2.5 rounded-xl border transition-colors ${view === "map" ? "bg-primary text-white border-primary" : "bg-white dark:bg-[#1e2028] text-text-secondary border-border dark:border-[#2a2d34]"}`}
                    >
                        <MapIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className={`flex flex-col ${view === "split" ? "lg:flex-row" : ""} gap-6`}>
                {/* Map */}
                <div className={view === "split" ? "lg:flex-1" : "w-full"}>
                    <GeoapifyMap
                        center={center}
                        zoom={12}
                        markers={allMarkers}
                        height={view === "map" ? "calc(100vh - 200px)" : "500px"}
                        showNavButton={false}
                    />
                </div>

                {/* Spots List */}
                {view === "split" && (
                    <div className="lg:w-96 space-y-3 max-h-[500px] overflow-y-auto">
                        <div className="flex items-center gap-2 px-1 pb-2 border-b border-border dark:border-[#2a2d34]">
                            <Filter className="w-4 h-4 text-text-muted" />
                            <span className="text-sm font-semibold text-text-secondary">
                                {MOCK_FOOD_SPOTS.length} spots found
                            </span>
                        </div>

                        {MOCK_FOOD_SPOTS.map((spot) => (
                            <Link
                                key={spot.id}
                                href={`/food/${spot.id}`}
                                className={`flex gap-3 p-3 rounded-xl border border-border dark:border-[#2a2d34] bg-white dark:bg-[#1e2028] hover:border-primary hover:shadow-md transition-all group ${selectedSpot === spot.id ? "border-primary shadow-md" : ""}`}
                                onMouseEnter={() => setSelectedSpot(spot.id)}
                                onMouseLeave={() => setSelectedSpot(null)}
                            >
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#2a2d34] flex-shrink-0 relative">
                                    <Image src={spot.image} alt={spot.placeName} fill className="object-cover" sizes="80px" />
                                    <span className="absolute bottom-1 right-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {spot.averageRating}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-text-primary dark:text-white truncate group-hover:text-primary transition-colors">
                                        {spot.placeName}
                                    </h3>
                                    <p className="text-xs text-text-muted mt-0.5">{spot.dishName} • {spot.dishCategory}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                            {spot.priceRange}
                                        </span>
                                        <span className="text-xs text-text-muted">•</span>
                                        <span className="text-xs text-text-muted flex items-center gap-0.5">
                                            <MapPin className="w-3 h-3" /> {spot.area}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-text-muted">🔥 {spot.upvotes}</span>
                                        <span className="text-xs text-text-muted">👥 {spot.beenHereCount} been here</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
