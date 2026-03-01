"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { DealCard } from "@/components/feed/DealCard";
import { fetchDeals } from "@/lib/client-api";
import type { Deal } from "@/lib/mock-data";

export default function PlatformDealsPage() {
    const params = useParams<{ platform: string }>();
    const platform = decodeURIComponent(params.platform ?? "");
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadDeals = async () => {
            setLoading(true);
            const data = await fetchDeals({
                platform,
                limit: 60,
                signal: controller.signal,
            });

            if (!active) return;
            setDeals(data.filter((deal) => deal.platform.toLowerCase() === platform.toLowerCase()));
            setLoading(false);
        };

        loadDeals().catch(() => {
            if (!active) return;
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [platform]);

    const title = useMemo(() => `${platform} Deals`, [platform]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
            <div>
                <h1 className="text-2xl font-extrabold text-text-primary dark:text-white">{title}</h1>
                <p className="text-sm text-text-secondary">Latest deals from {platform}</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-80 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
                    ))}
                </div>
            ) : deals.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-lg font-bold text-text-primary dark:text-white">No deals found</p>
                    <p className="text-sm text-text-secondary mt-1">No active deals for {platform} right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>
            )}
        </div>
    );
}
