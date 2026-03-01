"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Clock, MapPin, Star, Users } from "lucide-react";
import { fetchFoodSpotById, fetchFoodSpots } from "@/lib/client-api";
import { UpvoteButton } from "@/components/common/UpvoteButton";
import { SaveButton, ShareButton } from "@/components/common/ActionButtons";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import type { FoodSpot } from "@/lib/types";

const GeoapifyMap = dynamic(() => import("@/components/maps/GeoapifyMap"), { ssr: false });

export default function FoodSpotDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [spot, setSpot] = useState<FoodSpot | null>(null);
    const [similar, setSimilar] = useState<FoodSpot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();
        let active = true;

        const load = async () => {
            setLoading(true);
            const [spotData, allSpots] = await Promise.all([
                fetchFoodSpotById(id, controller.signal),
                fetchFoodSpots({ limit: 12, signal: controller.signal }),
            ]);

            if (!active) return;

            setSpot(spotData);
            setSimilar(
                (allSpots ?? [])
                    .filter((item) => item.id !== id && item.city === spotData?.city)
                    .slice(0, 3)
            );
            setLoading(false);
        };

        load().catch(() => {
            if (!active) return;
            setSpot(null);
            setSimilar([]);
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

    if (!spot) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                <p className="text-lg font-bold text-text-primary dark:text-white">Food spot not found</p>
                <Link href="/food" className="text-primary text-sm font-semibold mt-2 inline-block">Back to food spots</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <Link href="/food" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary">
                <ArrowLeft className="w-4 h-4" />
                Back to Food Spots
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34]">
                        <div className="relative aspect-video">
                            <Image src={spot.image} alt={spot.placeName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-primary">
                                {spot.dishCategory}
                            </div>
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-black/60 backdrop-blur-sm">
                                {spot.averageRating} ?
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <h1 className="text-xl md:text-2xl font-extrabold text-text-primary dark:text-white">{spot.placeName}</h1>
                            <p className="text-sm text-text-secondary">{spot.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-text-secondary">
                                <p className="inline-flex items-center gap-1"><MapPin className="w-4 h-4 text-primary" /> {spot.area}, {spot.city}</p>
                                <p className="inline-flex items-center gap-1"><Clock className="w-4 h-4 text-primary" /> {spot.timing}</p>
                                <p className="font-semibold text-accent-green">{spot.priceRange}</p>
                                <p className="inline-flex items-center gap-1"><Users className="w-4 h-4 text-primary" /> {spot.beenHereCount} visited</p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <Star className="w-3.5 h-3.5 text-yellow-500" />
                                {spot.ratingsCount} ratings
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {spot.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#2a2d34] text-xs text-text-secondary">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border dark:border-[#2a2d34]">
                                <UpvoteButton postId={spot.id} initialCount={spot.upvotes} />
                                <SaveButton postId={spot.id} entityType="food" />
                                <ShareButton />
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-4">
                    <GeoapifyMap
                        center={{ lat: spot.coordinates.lat, lng: spot.coordinates.lng }}
                        zoom={16}
                        markers={[
                            {
                                lat: spot.coordinates.lat,
                                lng: spot.coordinates.lng,
                                title: spot.placeName,
                                description: `${spot.dishCategory} · ${spot.priceRange}`,
                                emoji: "FS",
                            },
                        ]}
                        height="250px"
                    />

                    <div className="rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-4">
                        <h2 className="font-bold text-text-primary dark:text-white mb-3">Similar Spots</h2>
                        <div className="space-y-3">
                            {similar.length === 0 ? (
                                <p className="text-sm text-text-secondary">No similar spots available.</p>
                            ) : (
                                similar.map((item) => (
                                    <Link key={item.id} href={`/food/${item.id}`} className="block text-sm font-medium text-text-primary dark:text-white hover:text-primary line-clamp-2">
                                        {item.placeName}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            {similar.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-lg font-bold text-text-primary dark:text-white">More Food Spots</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similar.map((item) => (
                            <FoodSpotCard key={item.id} spot={item} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
