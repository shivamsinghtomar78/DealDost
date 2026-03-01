"use client";

import Image from "next/image";
import { Calendar, MapPin, Tag, Users, Share2, AlertTriangle, Wrench, Search } from "lucide-react";
import { UpvoteButton } from "@/components/common/UpvoteButton";
import { timeAgo, cn } from "@/lib/utils";
import type { Event } from "@/lib/types";

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
    event: { label: "ðŸŽ‰ Event", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    lost_found: { label: "ðŸ” Lost & Found", icon: Search, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    service: { label: "ðŸ”§ Service", icon: Wrench, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    alert: { label: "âš ï¸ Alert", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
};

export function EventCard({ event }: { event: Event }) {
    const config = typeConfig[event.eventType] || typeConfig.event;

    return (
        <div className="bg-white dark:bg-[#1e2028] rounded-2xl overflow-hidden border border-border dark:border-[#2a2d34] card-hover shadow-sm group">
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className={cn("absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg", config.bgColor, config.color)}>
                    {config.label}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2.5">
                <h3 className="font-bold text-base text-text-primary dark:text-white line-clamp-2">{event.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2">{event.description}</p>

                <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span>{event.dateTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                        <Tag className="w-4 h-4 text-accent-green shrink-0" />
                        <span className="font-semibold text-accent-green">{event.entryFee}</span>
                    </div>
                </div>

                {/* Interested Count */}
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium">{event.interestedCount}</span> interested
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border dark:border-[#2a2d34]">
                    <UpvoteButton postId={event.id} initialCount={event.upvotes} />
                    <button className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white gradient-primary hover:opacity-90 transition-opacity text-center">
                        I&apos;m Interested
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-gray-200 dark:hover:bg-[#3a3d44] transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>by @{event.postedBy.username}</span>
                    <span>â€¢</span>
                    <span>{timeAgo(event.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}
