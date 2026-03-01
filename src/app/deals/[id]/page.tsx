"use client";

import { use } from "react";
import { MOCK_DEALS } from "@/lib/mock-data";

import { CountdownTimer } from "@/components/common/CountdownTimer";
import { UpvoteButton } from "@/components/common/UpvoteButton";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft, ExternalLink, Shield, MessageCircle, Share2, Bookmark, Copy,
    TrendingDown, Trophy, ChevronRight, Send, Clock, CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

// Mock price history data
const PRICE_HISTORY = [
    { date: "Oct 1", price: 2999 },
    { date: "Oct 5", price: 2499 },
    { date: "Oct 10", price: 1999 },
    { date: "Oct 15", price: 2999 },
    { date: "Oct 20", price: 1499 },
    { date: "Oct 25", price: 2999 },
    { date: "Today", price: 899 },
];

const MOCK_COMMENTS = [
    { id: 1, user: "Arjun K.", avatar: "A", text: "Just ordered! Deal is still active ✅ Got it for ₹899 flat.", time: "2m ago", likes: 12 },
    { id: 2, user: "Priya S.", avatar: "P", text: "How's the battery life? I use earbuds at the gym daily.", time: "15m ago", likes: 5 },
    { id: 3, user: "Rahul M.", avatar: "R", text: "Thanks for sharing 🙏 Saved ₹2,100!", time: "1h ago", likes: 23 },
    { id: 4, user: "Neha D.", avatar: "N", text: "Sound quality is surprisingly good for this price. Bass is decent 🔥", time: "2h ago", likes: 8 },
];

const TOP_HUNTERS = [
    { name: "Arjun Dealdigger", deals: 432 },
    { name: "Priya Savings", deals: 210 },
    { name: "Karan Loot", deals: 189 },
];

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const deal = MOCK_DEALS.find((d) => d.id === id) || MOCK_DEALS[0];
    const relatedDeals = MOCK_DEALS.filter((d) => d.id !== deal.id).slice(0, 3);

    const maxPrice = Math.max(...PRICE_HISTORY.map((p) => p.price));
    const minPrice = Math.min(...PRICE_HISTORY.map((p) => p.price));

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                <Link href="/" className="hover:text-primary">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/deals" className="hover:text-primary">Deals</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary font-medium">{deal.platform}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Deal Hero Card */}
                    <motion.div
                        className="bg-white dark:bg-[#1e2028] rounded-2xl border border-border dark:border-[#2a2d34] overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Image */}
                        <div className="relative aspect-video bg-gray-100 dark:bg-[#2a2d34]">
                            <Image
                                src={deal.image}
                                alt={deal.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 60vw"
                            />
                            <div className="absolute top-4 left-4">
                                <span
                                    className="px-3 py-1.5 rounded-lg text-white text-sm font-bold shadow-lg"
                                    style={{ backgroundColor: deal.platform === "Amazon" ? "#FF9900" : deal.platform === "Flipkart" ? "#2874F0" : "#FF5722" }}
                                >
                                    {deal.platform}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-extrabold shadow-lg">
                                    -{deal.discountPercent}%
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-6">
                            <h1 className="text-2xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] mb-2">
                                {deal.title}
                            </h1>
                            <p className="text-text-secondary dark:text-gray-400 mb-4">
                                {deal.description}
                            </p>

                            {/* Price Section */}
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl font-extrabold text-green-600 dark:text-green-400 font-[family-name:var(--font-heading)]">
                                    {formatPrice(deal.dealPrice)}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                    {formatPrice(deal.originalPrice)}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold">
                                    {deal.discountPercent}% OFF
                                </span>
                            </div>

                            {/* Countdown */}
                            <div className="mb-4">
                                <CountdownTimer expiresAt={deal.expiresAt} />
                            </div>

                            {/* Verified Badge */}
                            <div className="flex items-center gap-2 mb-6 bg-green-50 dark:bg-green-900/10 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800/30">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                    Verified by {deal.verifiedCount} users
                                </span>
                            </div>

                            {/* CTA */}
                            <a
                                href={deal.dealLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Get This Deal on {deal.platform}
                            </a>
                        </div>
                    </motion.div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-3 bg-white dark:bg-[#1e2028] rounded-2xl p-4 border border-border dark:border-[#2a2d34]">
                        <UpvoteButton postId={deal.id} initialCount={deal.upvotes} />
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-gray-200 dark:hover:bg-[#353840] transition-colors text-sm font-medium">
                            <Bookmark className="w-4 h-4" /> Save
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-gray-200 dark:hover:bg-[#353840] transition-colors text-sm font-medium">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-gray-200 dark:hover:bg-[#353840] transition-colors text-sm font-medium">
                            <Copy className="w-4 h-4" /> Copy Link
                        </button>
                    </div>

                    {/* Price History Chart (Simple CSS) */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingDown className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)]">
                                Price History (30 Days)
                            </h2>
                        </div>
                        <div className="flex items-end gap-2 h-32">
                            {PRICE_HISTORY.map((point, i) => {
                                const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100;
                                const isLowest = point.price === minPrice;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-text-muted font-medium">
                                            {formatPrice(point.price)}
                                        </span>
                                        <motion.div
                                            className={`w-full rounded-t-lg ${isLowest ? "bg-gradient-to-t from-green-500 to-green-400" : "bg-gradient-to-t from-orange-300 to-orange-200 dark:from-orange-600 dark:to-orange-500"}`}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(height, 10)}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                        />
                                        <span className="text-[10px] text-text-muted">{point.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-3 text-center">
                            🎯 Current price is the LOWEST in 30 days!
                        </p>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                        <div className="flex items-center gap-2 mb-6">
                            <MessageCircle className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)]">
                                Comments ({MOCK_COMMENTS.length + 28})
                            </h2>
                        </div>

                        {/* Comment input */}
                        <div className="flex gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                S
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Share your experience with this deal..."
                                    className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-gray-200 dark:border-[#353840] text-sm focus:border-primary outline-none transition-colors"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Comments list */}
                        <div className="space-y-4">
                            {MOCK_COMMENTS.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#2a2d34] flex items-center justify-center text-sm font-bold text-text-secondary flex-shrink-0">
                                        {comment.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-text-primary dark:text-white">{comment.user}</span>
                                            <span className="text-xs text-text-muted flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {comment.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary dark:text-gray-300">{comment.text}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button className="text-xs text-text-muted hover:text-primary flex items-center gap-1">
                                                🔥 {comment.likes}
                                            </button>
                                            <button className="text-xs text-text-muted hover:text-primary">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:w-80 space-y-6">
                    {/* Related Deals */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-5 border border-border dark:border-[#2a2d34]">
                        <h3 className="text-base font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
                            ✨ Related Deals
                        </h3>
                        <div className="space-y-3">
                            {relatedDeals.map((d) => (
                                <Link key={d.id} href={`/deals/${d.id}`} className="flex gap-3 group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#2a2d34] flex-shrink-0 relative">
                                        <Image src={d.image} alt={d.title} fill className="object-cover" sizes="64px" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-primary dark:text-white truncate group-hover:text-primary transition-colors">
                                            {d.title}
                                        </p>
                                        <p className="text-sm font-bold text-green-600">{formatPrice(d.dealPrice)}</p>
                                        <p className="text-xs text-text-muted">🔥 {d.upvotes} upvotes</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Deal Hunters */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-5 border border-border dark:border-[#2a2d34]">
                        <h3 className="text-base font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" /> Top Deal Hunters
                        </h3>
                        <div className="space-y-3">
                            {TOP_HUNTERS.map((hunter, i) => (
                                <div key={hunter.name} className="flex items-center gap-3">
                                    <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-text-primary dark:text-white">{hunter.name}</p>
                                        <p className="text-xs text-text-muted">{hunter.deals} deals found</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Alert Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-5 border border-blue-200 dark:border-blue-800/30">
                        <h3 className="text-base font-extrabold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            🔔 Price Drop Alert
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                            Get notified when the price drops further!
                        </p>
                        <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
                            Set Alert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
