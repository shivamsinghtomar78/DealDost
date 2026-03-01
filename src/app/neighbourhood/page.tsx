"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/components/feed/EventCard";
import { cn } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";
import { fetchEvents } from "@/lib/client-api";
import type { Event } from "@/lib/types";

const TABS = [
    { id: "events", label: "Events" },
    { id: "lost_found", label: "Lost & Found" },
    { id: "service", label: "Services" },
    { id: "alert", label: "Alerts" },
] as const;

export default function NeighbourhoodPage() {
    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("events");
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadEvents = async () => {
            setLoading(true);
            setError(null);

            const typeQuery = activeTab === "events" ? "event" : activeTab;
            const data = await fetchEvents({
                type: typeQuery,
                search: search.trim() || undefined,
                limit: 30,
                signal: controller.signal,
            });

            if (!active) return;
            setEvents(data.filter((item) => item.eventType === typeQuery));
            setLoading(false);
        };

        loadEvents().catch((fetchError) => {
            if (!active) return;
            const message = fetchError instanceof Error ? fetchError.message : "Failed to load neighbourhood updates";
            setError(message);
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [activeTab, search]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-6 h-6 text-secondary" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        Neighbourhood Board
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">
                    What is happening in your area
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-bold ml-1">
                        Karol Bagh, Delhi
                    </span>
                </p>
            </div>

            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search updates"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

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

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-80 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-lg font-bold text-text-primary dark:text-white">Nothing here yet</p>
                    <p className="text-sm text-text-secondary mt-1">Be the first to post in your neighbourhood</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
