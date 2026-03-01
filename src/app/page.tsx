"use client";

import { MOCK_DEALS, MOCK_FOOD_SPOTS, MOCK_EVENTS, TRENDING_STATS } from "@/lib/mock-data";
import { DealCard } from "@/components/feed/DealCard";
import { FoodSpotCard } from "@/components/feed/FoodSpotCard";
import { EventCard } from "@/components/feed/EventCard";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { TrendingUp, Flame, UtensilsCrossed, MapPin, Zap, ArrowRight, ShoppingBag, Users, CalendarDays } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const trendingDeals = MOCK_DEALS.slice(0, 4);
  const nearbySpots = MOCK_FOOD_SPOTS.slice(0, 3);
  const recentEvents = MOCK_EVENTS.slice(0, 2);
  const flashDeals = MOCK_DEALS.filter((d) => {
    const h = (new Date(d.expiresAt).getTime() - Date.now()) / 3600000;
    return h < 6 && h > 0;
  }).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner */}
      <div className="gradient-hero rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 text-8xl">🛍️</div>
          <div className="absolute bottom-4 left-20 text-6xl">🍜</div>
          <div className="absolute top-10 left-10 text-5xl">🔥</div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-bold text-yellow-200 uppercase tracking-widest">Flash Deals — Expiring Soon!</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-[family-name:var(--font-heading)] mb-4">
            Apne sheher ki best deals, khana aur events — sab ek jagah 🇮🇳
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
                    <span className="font-bold text-yellow-200">₹{deal.dealPrice}</span>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Deals", value: TRENDING_STATS.totalDealsToday, icon: ShoppingBag, color: "text-primary" },
          { label: "Food Spots", value: TRENDING_STATS.totalFoodSpots, icon: UtensilsCrossed, color: "text-orange-500" },
          { label: "Events Today", value: TRENDING_STATS.totalEvents, icon: CalendarDays, color: "text-purple-500" },
          { label: "Active Cities", value: TRENDING_STATS.activeCities, icon: MapPin, color: "text-secondary" },
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

      {/* Trending Deals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
              Trending Deals Today
            </h2>
          </div>
          <Link href="/deals" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* Best Food Spots */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
              Best Food Spots Near You
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

      {/* Neighbourhood Updates */}
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

      {/* Top Contributors */}
      <section className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent-green" />
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
            Top Contributors This Week
          </h2>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {MOCK_DEALS.slice(0, 5).map((deal, i) => (
            <div key={deal.id} className="flex items-center gap-3 shrink-0">
              <span className="text-lg font-extrabold text-text-muted">#{i + 1}</span>
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
