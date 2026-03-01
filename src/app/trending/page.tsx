"use client";

import { MOCK_DEALS, MOCK_FOOD_SPOTS, MOCK_EVENTS } from "@/lib/mock-data";
import { DealCard } from "@/components/feed/DealCard";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { EventCard } from "@/components/feed/EventCard";
import { Flame, Trophy, UtensilsCrossed, MapPin, Zap } from "lucide-react";

export default function TrendingPage() {
    const topDeals = [...MOCK_DEALS].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
    const hotSpot = [...MOCK_FOOD_SPOTS].sort((a, b) => b.upvotes - a.upvotes)[0];
    const flashDeals = MOCK_DEALS.filter((d) => {
        const h = (new Date(d.expiresAt).getTime() - Date.now()) / 3600000;
        return h < 3 && h > 0;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        Daily Trending
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">What&apos;s hot today in deals, food, and events</p>
            </div>

            {/* Top 5 Deals */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        🏆 Top 5 Deals Today
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topDeals.map((deal, i) => (
                        <div key={deal.id} className="relative">
                            {i < 3 && (
                                <div className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-extrabold text-sm shadow-lg">
                                    {i + 1}
                                </div>
                            )}
                            <DealCard deal={deal} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Hottest Food Spot */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        🍜 Hottest Food Spot This Week
                    </h2>
                </div>
                <div className="max-w-md">
                    <FoodSpotCard spot={hotSpot} />
                </div>
            </section>

            {/* Flash Deals */}
            {flashDeals.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-orange-500" />
                        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                            ⚡ Flash Deals — Expiring Soon!
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
