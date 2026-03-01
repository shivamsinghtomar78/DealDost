"use client";

import { useEffect, useMemo, useState } from "react";
import { DealCard } from "@/components/feed/DealCard";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { Flame, Trophy, UtensilsCrossed, Zap } from "lucide-react";
import { fetchDeals, fetchFoodSpots } from "@/lib/client-api";
import type { Deal, FoodSpot } from "@/lib/mock-data";

export default function TrendingPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [spots, setSpots] = useState<FoodSpot[]>([]);
    const [loading, setLoading] = useState(true);
    const [referenceTime, setReferenceTime] = useState(() => Date.now());

    useEffect(() => {
        const timer = window.setInterval(() => {
            setReferenceTime(Date.now());
        }, 60000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadData = async () => {
            setLoading(true);
            const [dealData, spotData] = await Promise.all([
                fetchDeals({ sort: "hot", limit: 20, signal: controller.signal }),
                fetchFoodSpots({ sort: "popular", limit: 20, signal: controller.signal }),
            ]);

            if (!active) return;

            setDeals(dealData);
            setSpots(spotData);
            setLoading(false);
        };

        loadData().catch(() => {
            if (!active) return;
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const topDeals = useMemo(() => [...deals].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5), [deals]);
    const hotSpot = useMemo(() => [...spots].sort((a, b) => b.upvotes - a.upvotes)[0], [spots]);
    const flashDeals = useMemo(() => {
        return deals.filter((deal) => {
            const hoursLeft = (new Date(deal.expiresAt).getTime() - referenceTime) / 3600000;
            return hoursLeft > 0 && hoursLeft < 3;
        });
    }, [deals, referenceTime]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        Daily Trending
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">What is hot today in deals and food</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        Top Deals Today
                    </h2>
                </div>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-80 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topDeals.map((deal, index) => (
                            <div key={deal.id} className="relative">
                                {index < 3 && (
                                    <div className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-extrabold text-sm shadow-lg">
                                        {index + 1}
                                    </div>
                                )}
                                <DealCard deal={deal} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {hotSpot && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                            Hottest Food Spot This Week
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <FoodSpotCard spot={hotSpot} />
                    </div>
                </section>
            )}

            {flashDeals.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-orange-500" />
                        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                            Flash Deals - Expiring Soon
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {flashDeals.map((deal) => (
                            <DealCard key={deal.id} deal={deal} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
