import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Flame,
  MapPin,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

const modules = [
  {
    icon: ShoppingBag,
    title: "Online Deals Hub",
    description: "Amazon, Flipkart, Zepto and more with live expiry timers.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Spot Finder",
    description: "Best dishes by area with map pins, photos and community votes.",
  },
  {
    icon: MapPin,
    title: "Neighbourhood Board",
    description: "Local events, lost and found, services and alerts in your city.",
  },
  {
    icon: Flame,
    title: "Daily Trending",
    description: "Top 5 deals, hottest food spots and the most active areas.",
  },
];

const highlights = [
  "Deal expiry alerts",
  "Community verified deals",
  "Savings tracker",
  "Receipt proof upload",
  "Weekly leaderboard",
  "Map-based discovery",
];

export default function HomePage() {
  return (
    <div className="hero-surface relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-12 h-60 w-60 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] top-40 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="glass-panel rounded-3xl p-6 md:p-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-primary dark:border-white/20 dark:bg-white/10 dark:text-white">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            DealDost
          </p>

          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-text-primary dark:text-white md:text-5xl">
            Daily deals, food picks, and local buzz in one place.
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-text-secondary dark:text-gray-300 md:text-base">
            Apne sheher ki best discoveries, sorted by community.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white gradient-primary shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-5 py-2.5 text-sm font-semibold text-text-primary backdrop-blur hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Explore Feed
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/50 bg-white/40 px-3 py-1 text-xs font-medium text-text-secondary dark:border-white/20 dark:bg-white/10 dark:text-gray-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <article
              key={module.title}
              className="glass-card rounded-2xl p-5 md:p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-white/70 p-2.5 text-primary dark:bg-white/10">
                <module.icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-text-primary dark:text-white">
                {module.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-gray-300">
                {module.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Real-time
            </p>
            <p className="mt-1 text-base font-bold text-text-primary dark:text-white">
              Live upvotes and expiry timers
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Local-first
            </p>
            <p className="mt-1 text-base font-bold text-text-primary dark:text-white">
              City and area level discovery
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Fast
            </p>
            <p className="mt-1 flex items-center gap-2 text-base font-bold text-text-primary dark:text-white">
              <Clock3 className="h-4 w-4 text-primary" />
              Built for daily check-ins
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
