"use client";

import { EventCard } from "@/components/feed/EventCard";
import { fetchEvents } from "@/lib/client-api";
import { useEffect, useState } from "react";
import type { Event } from "@/lib/types";

export default function ServicesPage() {
    const [posts, setPosts] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadData = async () => {
            setLoading(true);
            const data = await fetchEvents({
                type: "service",
                limit: 30,
                signal: controller.signal,
            });
            if (!active) return;
            setPosts(data.filter((event) => event.eventType === "service"));
            setLoading(false);
        };

        loadData().catch(() => {
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
                <h1 className="text-2xl font-extrabold text-text-primary dark:text-white">Local Services</h1>
                <p className="text-sm text-text-secondary">Trusted local service recommendations from your community</p>
            </div>

            {loading ? (
                <p className="text-sm text-text-secondary">Loading services...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
