"use client";

import { EventCard } from "@/components/feed/EventCard";
import { fetchEvents } from "@/lib/client-api";
import { useEffect, useState } from "react";
import type { Event } from "@/lib/types";

export default function NeighbourhoodEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadEvents = async () => {
            setLoading(true);
            const data = await fetchEvents({
                type: "event",
                limit: 30,
                signal: controller.signal,
            });
            if (!active) return;
            setEvents(data.filter((event) => event.eventType === "event"));
            setLoading(false);
        };

        loadEvents().catch(() => {
            if (!active) return;
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
            <div>
                <h1 className="text-2xl font-extrabold text-text-primary dark:text-white">Neighbourhood Events</h1>
                <p className="text-sm text-text-secondary">Garba, concerts, markets, and local happenings</p>
            </div>

            {loading ? (
                <p className="text-sm text-text-secondary">Loading events...</p>
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
