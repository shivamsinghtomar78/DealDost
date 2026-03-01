"use client";

import { Bookmark, Share2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export function SaveButton({ postId, entityType = "deal" }: { postId: string; entityType?: "deal" | "food" }) {
    const { isSaved, toggleSaveDeal, toggleSaveFoodSpot } = useAuthStore();
    const saved = isSaved(postId);

    const toggle = () => {
        if (entityType === "food") {
            toggleSaveFoodSpot(postId);
            return;
        }

        toggleSaveDeal(postId);
    };

    return (
        <button
            onClick={toggle}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                saved
                    ? "bg-secondary/15 text-secondary dark:bg-secondary/25"
                    : "bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-secondary/10 hover:text-secondary"
            )}
        >
            <Bookmark className={cn("w-4 h-4", saved && "fill-secondary")} />
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
        </button>
    );
}

export function ShareButton() {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: "Check this deal on DealDost!", url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-gray-200 dark:hover:bg-[#3a3d44] transition-all"
        >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
        </button>
    );
}

export function GetDealButton({ link }: { link: string }) {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-white gradient-primary hover:opacity-90 transition-opacity shadow-md shadow-primary/25"
        >
            <ExternalLink className="w-3.5 h-3.5" />
            Get Deal
        </a>
    );
}
