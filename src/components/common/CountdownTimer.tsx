"use client";

import { useState, useEffect } from "react";
import { getCountdown } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export function CountdownTimer({ expiresAt, compact = false }: { expiresAt: string; compact?: boolean }) {
    const [countdown, setCountdown] = useState(getCountdown(expiresAt));

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getCountdown(expiresAt));
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    if (countdown.expired) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                ❌ Expired
            </span>
        );
    }

    const isUrgent = countdown.hours < 1;
    const isWarning = countdown.hours < 3;

    if (compact) {
        return (
            <span className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
                isUrgent ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                    isWarning ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
                        "bg-primary/10 text-primary"
            )}>
                ⏰ {countdown.hours}h {countdown.minutes}m
            </span>
        );
    }

    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold",
            isUrgent ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800" :
                isWarning ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800" :
                    "bg-primary/5 text-primary border border-primary/20"
        )}>
            <Clock className="w-4 h-4" />
            <span>
                {String(countdown.hours).padStart(2, "0")}:
                {String(countdown.minutes).padStart(2, "0")}:
                {String(countdown.seconds).padStart(2, "0")}
            </span>
            <span className="text-xs font-normal opacity-70">left</span>
        </div>
    );
}
