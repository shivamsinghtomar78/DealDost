"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MessageCircle } from "lucide-react";
import { formatPrice, timeAgo } from "@/lib/utils";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { UpvoteButton } from "@/components/common/UpvoteButton";
import { SaveButton, ShareButton, GetDealButton } from "@/components/common/ActionButtons";
import type { Deal } from "@/lib/mock-data";

export function DealCard({ deal }: { deal: Deal }) {
    return (
        <div className="bg-white dark:bg-[#1e2028] rounded-2xl overflow-hidden border border-border dark:border-[#2a2d34] card-hover shadow-sm group">
            {/* Image */}
            <Link href={`/deals/${deal.id}`} className="block relative aspect-[16/10] overflow-hidden">
                <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Discount Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-accent-red text-white text-sm font-extrabold shadow-lg">
                    -{deal.discountPercent}%
                </div>
                {/* Platform Badge */}
                <div className="absolute top-3 left-3">
                    <PlatformBadge platform={deal.platform} />
                </div>
            </Link>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Type + Category */}
                <div className="flex items-center gap-2">
                    <PlatformBadge platform={deal.platform} showType />
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-[#2a2d34] rounded-full text-xs font-medium text-text-secondary">
                        {deal.category}
                    </span>
                </div>

                {/* Title */}
                <Link href={`/deals/${deal.id}`}>
                    <h3 className="font-bold text-base text-text-primary dark:text-white line-clamp-2 hover:text-primary transition-colors">
                        {deal.title}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-text-secondary line-clamp-2">{deal.description}</p>

                {/* Price Section */}
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-extrabold text-accent-green font-[family-name:var(--font-heading)]">
                        {formatPrice(deal.dealPrice)}
                    </span>
                    <span className="text-base text-text-muted line-through">
                        {formatPrice(deal.originalPrice)}
                    </span>
                </div>

                {/* Countdown */}
                <CountdownTimer expiresAt={deal.expiresAt} />

                {/* Verified Badge */}
                {deal.verified && (
                    <div className="flex items-center gap-1.5 text-accent-green text-xs font-semibold">
                        <BadgeCheck className="w-4 h-4 fill-accent-green text-white" />
                        Verified by {deal.verifiedCount} users
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border dark:border-[#2a2d34] flex-wrap">
                    <UpvoteButton postId={deal.id} initialCount={deal.upvotes} />
                    <SaveButton postId={deal.id} />
                    <ShareButton />
                    <div className="ml-auto">
                        <GetDealButton link={deal.dealLink} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary-light overflow-hidden flex items-center justify-center text-white text-[8px] font-bold">
                        {deal.postedBy.name.charAt(0)}
                    </div>
                    <span>by @{deal.postedBy.username}</span>
                    <span>•</span>
                    <span>{timeAgo(deal.createdAt)}</span>
                    <span className="ml-auto flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {deal.commentsCount}
                    </span>
                </div>
            </div>
        </div>
    );
}
