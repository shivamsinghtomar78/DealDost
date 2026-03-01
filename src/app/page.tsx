"use client";

import { useEffect, useMemo, useState } from "react";
import { DealCard } from "@/components/feed/DealCard";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { EventCard } from "@/components/feed/EventCard";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import {
  TrendingUp,
  Flame,
  UtensilsCrossed,
  MapPin,
  Zap,
  ArrowRight,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { fetchDeals, fetchEvents, fetchFoodSpots } from "@/lib/client-api";
import type { Deal, Event, FoodSpot } from "@/lib/mock-data";

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [spots, setSpots] = useState<FoodSpot[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [referenceTime, setReferenceTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setReferenceTime(Date.now());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadData = async () => {
      setLoading(true);
      const [dealData, spotData, eventData] = await Promise.all([
        fetchDeals({ sort: "hot", limit: 12, signal: controller.signal }),
        fetchFoodSpots({ sort: "popular", limit: 9, signal: controller.signal }),
        fetchEvents({ type: "event", limit: 8, signal: controller.signal }),
      ]);

      if (!active) return;

      setDeals(dealData);
      setSpots(spotData);
      setEvents(eventData);
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

  const flashDeals = useMemo(() => {
    return deals
      .filter((deal) => {
        const hoursLeft = (new Date(deal.expiresAt).getTime() - referenceTime) / 3600000;
        return hoursLeft > 0 && hoursLeft < 6;
      })
      .slice(0, 3);
  }, [deals, referenceTime]);

  const trendingDeals = useMemo(() => deals.slice(0, 4), [deals]);
  const nearbySpots = useMemo(() => spots.slice(0, 3), [spots]);
  const recentEvents = useMemo(() => events.slice(0, 2), [events]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div className="gradient-hero rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-bold text-yellow-200 uppercase tracking-widest">Flash Deals - Expiring Soon</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-[family-name:var(--font-heading)] mb-4">
            Daily deals, food discoveries, and local updates in one place
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            {flashDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/25 transition-colors"
              >
                <div className="text-sm">
                  <p className="font-bold line-clamp-1">{deal.title.substring(0, 25)}...</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-yellow-200">Rs {deal.dealPrice}</span>
                    <CountdownTimer expiresAt={deal.expiresAt} compact />
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/deals"
              className="flex items-center gap-2 px-5 py-3 bg-white text-primary rounded-xl font-bold text-sm hover:shadow-lg transition-all"
            >
              View All Deals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Deals", value: deals.length, icon: ShoppingBag, color: "text-primary" },
          { label: "Food Spots", value: spots.length, icon: UtensilsCrossed, color: "text-orange-500" },
          { label: "Events", value: events.length, icon: CalendarDays, color: "text-purple-500" },
          { label: "Cities", value: 1, icon: MapPin, color: "text-secondary" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#1e2028] rounded-2xl p-4 border border-border dark:border-[#2a2d34] flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gray-100 dark:bg-[#2a2d34] ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)]">
                {stat.value}
              </p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
              Trending Deals
            </h2>
          </div>
          <Link href="/deals" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
              Best Food Spots
            </h2>
          </div>
          <Link href="/food" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbySpots.map((spot) => (
            <FoodSpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
              Neighbourhood Updates
            </h2>
          </div>
          <Link href="/neighbourhood" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent-green" />
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
            Top Contributors This Week
          </h2>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {trendingDeals.map((deal, index) => (
            <div key={deal.id} className="flex items-center gap-3 shrink-0">
              <span className="text-lg font-extrabold text-text-muted">#{index + 1}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                {deal.postedBy.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary dark:text-white">{deal.postedBy.name}</p>
                <p className="text-xs text-text-muted">{deal.upvotes} upvotes</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
