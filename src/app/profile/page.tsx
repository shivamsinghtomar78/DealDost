"use client";

import { useEffect, useMemo, useState } from "react";
import { DealCard } from "@/components/feed/DealCard";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { ShoppingBag, Heart, Flame, MapPin, TrendingUp, UtensilsCrossed } from "lucide-react";
import { mapDealDoc, mapFoodSpotDoc } from "@/lib/transformers";
import type { Deal, FoodSpot } from "@/lib/types";

const BADGES: Record<string, { label: string; color: string }> = {
    top_contributor: { label: "Top Contributor", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
    deal_hunter: { label: "Deal Hunter", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    food_explorer: { label: "Food Explorer", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
};

interface GenericPost {
    _id: string;
    title: string;
    type: string;
    upvotes: number;
    createdAt: string;
}

export default function ProfilePage() {
    const [tab, setTab] = useState<"posts" | "deals" | "food">("posts");
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("tab") === "saved") {
            setTab("deals");
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<GenericPost[]>([]);
    const [savedDeals, setSavedDeals] = useState<Deal[]>([]);
    const [savedSpots, setSavedSpots] = useState<FoodSpot[]>([]);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const controller = new AbortController();
        let active = true;

        const load = async () => {
            setLoading(true);
            const [postsRes, savedRes] = await Promise.all([
                fetch(`/api/users/${user.id}/posts`, { cache: "no-store", signal: controller.signal }),
                fetch(`/api/users/${user.id}/saved`, { cache: "no-store", signal: controller.signal }),
            ]);

            if (!active) return;

            if (postsRes.ok) {
                const postsJson = (await postsRes.json()) as { posts?: GenericPost[] };
                setPosts(postsJson.posts ?? []);
            } else {
                setPosts([]);
            }

            if (savedRes.ok) {
                const savedJson = (await savedRes.json()) as {
                    deals?: Record<string, unknown>[];
                    foodSpots?: Record<string, unknown>[];
                };
                setSavedDeals((savedJson.deals ?? []).map((deal) => mapDealDoc(deal)));
                setSavedSpots((savedJson.foodSpots ?? []).map((spot) => mapFoodSpotDoc(spot)));
            } else {
                setSavedDeals([]);
                setSavedSpots([]);
            }

            setLoading(false);
        };

        load().catch(() => {
            if (!active) return;
            setPosts([]);
            setSavedDeals([]);
            setSavedSpots([]);
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [user?.id]);

    const savingsLabel = useMemo(() => `Rs ${user?.totalSaved?.toLocaleString("en-IN") ?? "0"}`, [user?.totalSaved]);

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-8 text-center">
                    <p className="text-lg font-bold text-text-primary dark:text-white">Login to view your profile</p>
                    <p className="text-sm text-text-secondary mt-1">Your saved deals, food spots, and activity will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-extrabold ring-4 ring-white dark:ring-[#2a2d34] shadow-xl">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-center sm:text-left flex-1 min-w-0">
                        <h1 className="text-xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] truncate">
                            {user.name}
                        </h1>
                        <p className="text-sm text-text-muted">@{user.username}</p>
                        <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span className="text-sm text-text-secondary">{user.area}, {user.city}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                        { label: "Posts", value: user.postsCount, icon: ShoppingBag },
                        { label: "Upvotes", value: user.totalUpvotes.toLocaleString(), icon: Flame },
                        { label: "Saved", value: savingsLabel, icon: TrendingUp },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-[#2a2d34] rounded-xl">
                            <p className="text-xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] break-all">
                                {stat.value}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {user.badges.map((badge) => {
                        const badgeConfig = BADGES[badge];
                        return badgeConfig ? (
                            <span key={badge} className={cn("px-3 py-1.5 rounded-full text-xs font-bold", badgeConfig.color)}>
                                {badgeConfig.label}
                            </span>
                        ) : null;
                    })}
                </div>
            </div>

            <div className="gradient-primary rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider opacity-80">Total Savings via DealDost</span>
                </div>
                <p className="text-4xl font-extrabold font-[family-name:var(--font-heading)]">{savingsLabel}</p>
                <p className="text-sm opacity-80 mt-1">this month</p>
            </div>

            <div className="flex border-b border-border overflow-x-auto">
                {[
                    { id: "posts" as const, label: "My Posts", icon: ShoppingBag },
                    { id: "deals" as const, label: "Saved Deals", icon: Heart },
                    { id: "food" as const, label: "Saved Food Spots", icon: UtensilsCrossed },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-all shrink-0",
                            tab === item.id
                                ? "border-primary text-primary"
                                : "border-transparent text-text-muted hover:text-text-secondary"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-72 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
                    ))}
                </div>
            ) : tab === "posts" ? (
                posts.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-6 text-center">
                        <p className="font-bold text-text-primary dark:text-white">No posts yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <div key={post._id} className="rounded-xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-4">
                                <p className="font-semibold text-text-primary dark:text-white">{post.title}</p>
                                <p className="text-xs text-text-muted mt-1">{post.type} Â· {post.upvotes} upvotes</p>
                            </div>
                        ))}
                    </div>
                )
            ) : tab === "deals" ? (
                savedDeals.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-6 text-center">
                        <p className="font-bold text-text-primary dark:text-white">No saved deals</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedDeals.map((deal) => (
                            <DealCard key={deal.id} deal={deal} />
                        ))}
                    </div>
                )
            ) : savedSpots.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-6 text-center">
                    <p className="font-bold text-text-primary dark:text-white">No saved food spots</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedSpots.map((spot) => (
                        <FoodSpotCard key={spot.id} spot={spot} />
                    ))}
                </div>
            )}
        </div>
    );
}
