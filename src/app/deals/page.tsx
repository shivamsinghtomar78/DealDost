"use client";

import { useEffect, useMemo, useState } from "react";
import { PLATFORMS } from "@/lib/mock-data";
import { DEAL_CATEGORIES } from "@/lib/utils";
import { DealCard } from "@/components/feed/DealCard";
import { cn } from "@/lib/utils";
import { ShoppingCart, Zap, Search } from "lucide-react";
import { fetchDeals } from "@/lib/client-api";
import type { Deal } from "@/lib/mock-data";

export default function DealsPage() {
    const [platform, setPlatform] = useState("All");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("hot");
    const [showExpiring, setShowExpiring] = useState(false);
    const [search, setSearch] = useState("");

    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [referenceTime, setReferenceTime] = useState(() => Date.now());

    useEffect(() => {
        const interval = window.setInterval(() => {
            setReferenceTime(Date.now());
        }, 60000);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadDeals = async () => {
            setLoading(true);
            setError(null);

            const data = await fetchDeals({
                platform,
                category,
                sort: sortBy === "latest" ? "newest" : sortBy,
                search: search.trim() || undefined,
                expiringSoon: showExpiring,
                limit: 60,
                signal: controller.signal,
            });

            if (!active) return;

            setDeals(data);
            setLoading(false);
        };

        loadDeals().catch((fetchError) => {
            if (!active) return;
            const message = fetchError instanceof Error ? fetchError.message : "Failed to load deals";
            setError(message);
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [platform, category, sortBy, showExpiring, search]);

    const filtered = useMemo(() => {
        return deals.filter((deal) => {
            if (!showExpiring) return true;
            const hoursLeft = (new Date(deal.expiresAt).getTime() - referenceTime) / 3600000;
            return hoursLeft > 0 && hoursLeft <= 3;
        });
    }, [deals, showExpiring, referenceTime]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        All Deals
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">
                    Community-curated deals across India
                    <span className="font-semibold text-primary"> Â· {filtered.length} active</span>
                </p>
            </div>

            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search deals or products"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

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
                        onClick={() => setShowExpiring((current) => !current)}
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
                        <option value="hot">Hot</option>
                        <option value="latest">Latest</option>
                        <option value="discount">Highest Discount</option>
                    </select>
                </div>
            </div>

            {loading ? (
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
                    <p className="text-lg font-bold text-text-primary dark:text-white">No deals found</p>
                    <p className="text-sm text-text-secondary mt-1">Try changing your filters or search query</p>
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
