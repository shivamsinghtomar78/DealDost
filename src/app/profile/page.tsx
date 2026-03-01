"use client";

import { MOCK_USER, MOCK_DEALS, MOCK_FOOD_SPOTS } from "@/lib/mock-data";
import { DealCard } from "@/components/feed/DealCard";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, ShoppingBag, Heart, Flame, MapPin, Medal, TrendingUp, UtensilsCrossed } from "lucide-react";

const BADGES: Record<string, { label: string; emoji: string; color: string }> = {
    top_contributor: { label: "Top Contributor", emoji: "🏅", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
    deal_hunter: { label: "Deal Hunter", emoji: "🎯", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    food_explorer: { label: "Food Explorer", emoji: "🍜", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
};

export default function ProfilePage() {
    const [tab, setTab] = useState<"posts" | "deals" | "food">("posts");
    const user = MOCK_USER;
    const userDeals = MOCK_DEALS.filter((d) => user.savedDeals.includes(d.id));
    const userSpots = MOCK_FOOD_SPOTS.filter((s) => user.savedFoodSpots.includes(s.id));

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-extrabold ring-4 ring-white dark:ring-[#2a2d34] shadow-xl">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)]">
                            {user.name}
                        </h1>
                        <p className="text-sm text-text-muted">@{user.username}</p>
                        <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span className="text-sm text-text-secondary">{user.area}, {user.city}</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                        { label: "Posts", value: user.postsCount, icon: ShoppingBag },
                        { label: "Upvotes", value: user.totalUpvotes.toLocaleString(), icon: Flame },
                        { label: "Saved", value: `₹${user.totalSaved.toLocaleString()}`, icon: TrendingUp },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-[#2a2d34] rounded-xl">
                            <p className="text-xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)]">
                                {stat.value}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {user.badges.map((badge) => {
                        const b = BADGES[badge];
                        return b ? (
                            <span key={badge} className={cn("px-3 py-1.5 rounded-full text-xs font-bold", b.color)}>
                                {b.emoji} {b.label}
                            </span>
                        ) : null;
                    })}
                </div>
            </div>

            {/* Savings Card */}
            <div className="gradient-primary rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider opacity-80">Total Savings via DealDost</span>
                </div>
                <p className="text-4xl font-extrabold font-[family-name:var(--font-heading)]">
                    ₹{user.totalSaved.toLocaleString("en-IN")}
                </p>
                <p className="text-sm opacity-80 mt-1">this month • Keep saving! 🎉</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                {[
                    { id: "posts" as const, label: "My Posts", icon: ShoppingBag },
                    { id: "deals" as const, label: "Saved Deals", icon: Heart },
                    { id: "food" as const, label: "Saved Food Spots", icon: UtensilsCrossed },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-all",
                            tab === t.id
                                ? "border-primary text-primary"
                                : "border-transparent text-text-muted hover:text-text-secondary"
                        )}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {tab === "posts" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_DEALS.slice(0, 4).map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>
            )}
            {tab === "deals" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDeals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>
            )}
            {tab === "food" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userSpots.map((spot) => (
                        <FoodSpotCard key={spot.id} spot={spot} />
                    ))}
                </div>
            )}
        </div>
    );
}

