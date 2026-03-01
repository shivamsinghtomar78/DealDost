"use client";

import { PLATFORM_COLORS, QUICK_COMMERCE } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Zap, ShoppingBag } from "lucide-react";

export function PlatformBadge({ platform, showType = false }: { platform: string; showType?: boolean }) {
    const color = PLATFORM_COLORS[platform] || "#666";
    const isQuickCommerce = QUICK_COMMERCE.includes(platform);

    return (
        <div className="flex items-center gap-1.5">
            <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: color }}
            >
                {platform}
            </span>
            {showType && (
                <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                    isQuickCommerce
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                )}>
                    {isQuickCommerce ? <Zap className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                    {isQuickCommerce ? "Quick Commerce" : "E-Commerce"}
                </span>
            )}
        </div>
    );
}
