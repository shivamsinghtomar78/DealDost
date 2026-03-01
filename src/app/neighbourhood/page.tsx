"use client";

import { useState } from "react";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { EventCard } from "@/components/feed/EventCard";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

const TABS = [
    { id: "events", label: "🎉 Events" },
    { id: "lost_found", label: "🔍 Lost & Found" },
    { id: "service", label: "🏠 Services" },
    { id: "alert", label: "📢 Alerts" },
];

export default function NeighbourhoodPage() {
    const [activeTab, setActiveTab] = useState("events");

    const filtered = MOCK_EVENTS.filter((e) => {
        if (activeTab === "events") return e.eventType === "event";
        return e.eventType === activeTab;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-6 h-6 text-secondary" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        Neighbourhood Board
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">
                    What&apos;s happening in your area •{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-bold">
                        📍 Karol Bagh, Delhi
                    </span>
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1e2028] rounded-xl p-1 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-white dark:bg-[#2a2d34] text-primary shadow-sm"
                                : "text-text-muted hover:text-text-secondary"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">📍</div>
                    <p className="text-lg font-bold text-text-primary dark:text-white">Nothing here yet</p>
                    <p className="text-sm text-text-secondary mt-1">Be the first to post in your neighbourhood!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
