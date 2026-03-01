"use client";

import { useState } from "react";
import { MOCK_DEALS, PLATFORMS } from "@/lib/mock-data";
import { DEAL_CATEGORIES } from "@/lib/utils";
import { DealCard } from "@/components/feed/DealCard";
import { cn } from "@/lib/utils";
import { ShoppingCart, Zap, SlidersHorizontal } from "lucide-react";

export default function DealsPage() {
    const [platform, setPlatform] = useState("All");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("hot");
    const [showExpiring, setShowExpiring] = useState(false);

    const filtered = MOCK_DEALS.filter((deal) => {
        if (platform !== "All" && deal.platform !== platform) return false;
        if (category !== "All" && deal.category !== category) return false;
        if (showExpiring) {
            const h = (new Date(deal.expiresAt).getTime() - Date.now()) / 3600000;
            if (h > 3) return false;
        }
        return true;
    }).sort((a, b) => {
        if (sortBy === "hot") return b.upvotes - a.upvotes;
        if (sortBy === "latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "discount") return b.discountPercent - a.discountPercent;
        return 0;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        All Deals
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">
                    Community-curated deals from across India • <span className="font-semibold text-primary">{MOCK_DEALS.length} active deals</span>
                </p>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                {PLATFORMS.map((p) => (
                    <button
                        key={p.name}
                        onClick={() => setPlatform(p.name)}
                        className={cn(
                            "shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all border",
                            platform === p.name
                                ? "text-white shadow-lg"
                                : "bg-white dark:bg-[#1e2028] text-text-secondary border-border dark:border-[#2a2d34] hover:border-primary/50"
                        )}
                        style={platform === p.name ? { backgroundColor: p.color, borderColor: p.color } : {}}
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            {/* Category + Sort */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {DEAL_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={cn(
                                "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                                category === cat
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-primary/10 hover:text-primary"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={() => setShowExpiring(!showExpiring)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                            showExpiring
                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 ring-2 ring-orange-300"
                                : "bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-orange-50"
                        )}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Expiring Soon
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-[#2a2d34] text-text-secondary border-0 outline-none cursor-pointer"
                    >
                        <option value="hot">🔥 Hot</option>
                        <option value="latest">🕐 Latest</option>
                        <option value="discount">💰 Highest Discount</option>
                    </select>
                </div>
            </div>

            {/* Deal Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-lg font-bold text-text-primary dark:text-white">No deals found</p>
                    <p className="text-sm text-text-secondary mt-1">Try changing your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>
            )}
        </div>
    );
}
