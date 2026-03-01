"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { fetchFoodSpots } from "@/lib/client-api";
import type { FoodSpot } from "@/lib/types";

export default function DishFoodSpotsPage() {
    const params = useParams<{ dish: string }>();
    const dish = decodeURIComponent(params.dish ?? "");
    const [spots, setSpots] = useState<FoodSpot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadSpots = async () => {
            setLoading(true);
            const data = await fetchFoodSpots({
                dish,
                limit: 60,
                signal: controller.signal,
            });

            if (!active) return;
            setSpots(data.filter((spot) => spot.dishCategory.toLowerCase() === dish.toLowerCase() || spot.dishName.toLowerCase() === dish.toLowerCase()));
            setLoading(false);
        };

        loadSpots().catch(() => {
            if (!active) return;
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [dish]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
            <div>
                <h1 className="text-2xl font-extrabold text-text-primary dark:text-white">{dish} Spots</h1>
                <p className="text-sm text-text-secondary">Community-recommended places for {dish}</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-80 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
                    ))}
                </div>
            ) : spots.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-lg font-bold text-text-primary dark:text-white">No spots found</p>
                    <p className="text-sm text-text-secondary mt-1">Try another dish category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {spots.map((spot) => (
                        <FoodSpotCard key={spot.id} spot={spot} />
                    ))}
                </div>
            )}
        </div>
    );
}
