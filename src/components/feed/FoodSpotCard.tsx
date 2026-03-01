"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Star, Navigation, Camera, Users } from "lucide-react";
import { timeAgo, DISH_EMOJIS } from "@/lib/utils";
import { UpvoteButton } from "@/components/common/UpvoteButton";
import { SaveButton, ShareButton } from "@/components/common/ActionButtons";
import type { FoodSpot } from "@/lib/mock-data";

export function FoodSpotCard({ spot }: { spot: FoodSpot }) {
    const emoji = DISH_EMOJIS[spot.dishCategory] || "🍽️";

    return (
        <div className="bg-white dark:bg-[#1e2028] rounded-2xl overflow-hidden border border-border dark:border-[#2a2d34] card-hover shadow-sm group">
            {/* Image */}
            <Link href={`/food/${spot.id}`} className="block relative aspect-[16/10] overflow-hidden">
                <Image
                    src={spot.image}
                    alt={spot.placeName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Dish Tag */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-primary text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span>{emoji}</span>
                    {spot.dishName}
                </div>
                {/* Rating */}
                <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-lg text-sm font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {spot.averageRating}
                </div>
            </Link>

            {/* Content */}
            <div className="p-4 space-y-2.5">
                {/* Place Name */}
                <Link href={`/food/${spot.id}`}>
                    <h3 className="font-bold text-base text-text-primary dark:text-white hover:text-primary transition-colors line-clamp-1">
                        {spot.placeName}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-text-secondary line-clamp-2">{spot.description}</p>

                {/* Info Row */}
                <div className="flex items-center gap-3 text-sm text-text-secondary flex-wrap">
                    <span className="font-bold text-accent-green">{spot.priceRange}</span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {spot.area}, {spot.city}
                    </span>
                </div>

                {/* Timing + Landmark */}
                <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {spot.timing}
                    </span>
                    <span>📍 {spot.landmark}</span>
                </div>

                {/* Rating Bar */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= Math.floor(spot.averageRating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-text-muted">({spot.ratingsCount})</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {spot.tags.slice(0, 4).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-[#2a2d34] rounded-full text-[10px] font-semibold text-text-secondary"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Been Here */}
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium">{spot.beenHereCount}</span> people visited
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border dark:border-[#2a2d34] flex-wrap">
                    <UpvoteButton postId={spot.id} initialCount={spot.upvotes} />
                    <SaveButton postId={spot.id} />
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all">
                        <Navigation className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Directions</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-gray-200 dark:hover:bg-[#3a3d44] transition-all">
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary-light overflow-hidden flex items-center justify-center text-white text-[8px] font-bold">
                        {spot.postedBy.name.charAt(0)}
                    </div>
                    <span>by @{spot.postedBy.username}</span>
                    <span>•</span>
                    <span>{timeAgo(spot.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}
