"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Tag, Clock, ShieldCheck } from "lucide-react";
import { fetchDealById, fetchDeals } from "@/lib/client-api";
import { formatPrice, timeAgo } from "@/lib/utils";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { UpvoteButton } from "@/components/common/UpvoteButton";
import { SaveButton, ShareButton } from "@/components/common/ActionButtons";
import { DealCard } from "@/components/feed/DealCard";
import type { Deal } from "@/lib/types";

export default function DealDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [deal, setDeal] = useState<Deal | null>(null);
    const [related, setRelated] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();
        let active = true;

        const load = async () => {
            setLoading(true);
            const [dealData, allDeals] = await Promise.all([
                fetchDealById(id, controller.signal),
                fetchDeals({ limit: 8, signal: controller.signal }),
            ]);

            if (!active) return;

            setDeal(dealData);
            setRelated((allDeals ?? []).filter((item) => item.id !== id).slice(0, 3));
            setLoading(false);
        };

        load().catch(() => {
            if (!active) return;
            setDeal(null);
            setRelated([]);
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="h-96 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
            </div>
        );
    }

    if (!deal) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                <p className="text-lg font-bold text-text-primary dark:text-white">Deal not found</p>
                <Link href="/deals" className="text-primary text-sm font-semibold mt-2 inline-block">Back to deals</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <Link href="/deals" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary">
                <ArrowLeft className="w-4 h-4" />
                Back to Deals
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34]">
                        <div className="relative aspect-video">
                            <Image src={deal.image} alt={deal.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-primary">
                                {deal.platform}
                            </div>
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-accent-red">
                                {deal.discountPercent}% OFF
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <h1 className="text-xl md:text-2xl font-extrabold text-text-primary dark:text-white">{deal.title}</h1>
                            <p className="text-sm text-text-secondary">{deal.description}</p>

                            <div className="flex items-end gap-3 flex-wrap">
                                <p className="text-3xl font-extrabold text-accent-green">{formatPrice(deal.dealPrice)}</p>
                                <p className="text-lg text-text-muted line-through">{formatPrice(deal.originalPrice)}</p>
                            </div>

                            <CountdownTimer expiresAt={deal.expiresAt} />

                            <div className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
                                <span className="inline-flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {deal.category}</span>
                                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {timeAgo(deal.createdAt)}</span>
                                {deal.verified && (
                                    <span className="inline-flex items-center gap-1 text-accent-green"><ShieldCheck className="w-3.5 h-3.5" /> verified by {deal.verifiedCount}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border dark:border-[#2a2d34]">
                                <UpvoteButton postId={deal.id} initialCount={deal.upvotes} />
                                <SaveButton postId={deal.id} entityType="deal" />
                                <ShareButton />
                                <a
                                    href={deal.dealLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white gradient-primary"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Get Deal
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-4">
                        <h2 className="font-bold text-text-primary dark:text-white mb-3">Related Deals</h2>
                        <div className="space-y-3">
                            {related.length === 0 ? (
                                <p className="text-sm text-text-secondary">No related deals available.</p>
                            ) : (
                                related.map((item) => (
                                    <Link key={item.id} href={`/deals/${item.id}`} className="block text-sm font-medium text-text-primary dark:text-white hover:text-primary line-clamp-2">
                                        {item.title}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            {related.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-lg font-bold text-text-primary dark:text-white">More Deals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {related.map((item) => (
                            <DealCard key={item.id} deal={item} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
