"use client";

import { use } from "react";
import { MOCK_FOOD_SPOTS } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft, Star, MapPin, Clock, ChevronRight, Flame, Bookmark, Navigation,
    Camera, Share2, Users, Send, Phone
} from "lucide-react";
import { UpvoteButton } from "@/components/common/UpvoteButton";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const GeoapifyMap = dynamic(() => import("@/components/maps/GeoapifyMap"), { ssr: false });

const MOCK_REVIEWS = [
    { id: 1, user: "Ananya R.", avatar: "A", rating: 5, text: "Best momos in all of Delhi! The spicy chutney is out of this world 🔥", time: "1 week ago", helpful: 18 },
    { id: 2, user: "Vikram S.", avatar: "V", rating: 4, text: "Great taste but the queue is insane on weekends. Go on weekdays!", time: "2 weeks ago", helpful: 12 },
    { id: 3, user: "Sneha M.", avatar: "S", rating: 5, text: "Tandoori momos ₹80 — absolute value for money. Must try!", time: "3 weeks ago", helpful: 25 },
];

const MENU_ITEMS = [
    { name: "Steamed Momos (8 pcs)", price: 40, tag: "⭐ Bestseller" },
    { name: "Fried Momos (8 pcs)", price: 60, tag: "" },
    { name: "Tandoori Momos (8 pcs)", price: 80, tag: "🔥 Must Try" },
    { name: "Kurkure Momos (8 pcs)", price: 70, tag: "" },
    { name: "Mayo Momos (8 pcs)", price: 60, tag: "" },
];

export default function FoodSpotDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const spot = MOCK_FOOD_SPOTS.find((s) => s.id === id) || MOCK_FOOD_SPOTS[0];
    const similarSpots = MOCK_FOOD_SPOTS.filter((s) => s.id !== spot.id).slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                <Link href="/" className="hover:text-primary">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/food" className="hover:text-primary">Food Spots</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary font-medium">{spot.placeName}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Hero Image */}
                    <motion.div
                        className="relative aspect-video rounded-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Image src={spot.image} alt={spot.placeName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-lg bg-[#FF5722] text-white text-sm font-bold shadow-lg">
                                🍽️ {spot.dishCategory}
                            </span>
                        </div>
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm font-bold flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {spot.averageRating}
                            </span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur text-white text-xs font-medium flex items-center gap-1">
                                <Camera className="w-3.5 h-3.5" /> 24 photos
                            </span>
                        </div>
                    </motion.div>

                    {/* Place Header */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h1 className="text-2xl font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)]">
                                    {spot.placeName}
                                </h1>
                                <p className="text-text-secondary dark:text-gray-400 mt-1">{spot.description}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold whitespace-nowrap">
                                ● Open Now
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{spot.area}, {spot.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{spot.timing}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-green-600 dark:text-green-400 font-bold">
                                    {spot.priceRange}
                                </span>
                                <span className="text-text-muted">per plate</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <Users className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{spot.beenHereCount} been here</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {spot.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border dark:border-[#2a2d34]">
                            <UpvoteButton postId={spot.id} initialCount={spot.upvotes} />
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#2a2d34] text-sm font-medium hover:bg-gray-200 transition-colors">
                                <Bookmark className="w-4 h-4" /> Save
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-200 transition-colors">
                                <Navigation className="w-4 h-4" /> Directions
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#2a2d34] text-sm font-medium hover:bg-gray-200 transition-colors">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                        <h2 className="text-lg font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] mb-4">⭐ Ratings</h2>
                        <div className="flex items-center gap-6 mb-4 flex-wrap">
                            <div className="text-center">
                                <p className="text-4xl font-extrabold text-text-primary dark:text-white">{spot.averageRating}</p>
                                <div className="flex gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(spot.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <p className="text-xs text-text-muted mt-1">{spot.ratingsCount} ratings</p>
                            </div>
                            <div className="flex-1 space-y-2">
                                {[
                                    { label: "Taste", value: 4.9 },
                                    { label: "Portion", value: 4.5 },
                                    { label: "Value", value: 4.7 },
                                    { label: "Hygiene", value: 4.2 },
                                ].map((r) => (
                                    <div key={r.label} className="flex items-center gap-3">
                                        <span className="text-xs text-text-muted w-14">{r.label}</span>
                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-[#2a2d34] rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-yellow-400 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(r.value / 5) * 100}%` }}
                                                transition={{ duration: 0.8 }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-text-primary dark:text-white w-8">{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                        <h2 className="text-lg font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] mb-4">🍽️ Menu</h2>
                        <div className="space-y-3">
                            {MENU_ITEMS.map((item) => (
                                <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-[#2a2d34] last:border-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-text-primary dark:text-white">{item.name}</span>
                                        {item.tag && <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-2 py-0.5 rounded-full">{item.tag}</span>}
                                    </div>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                        <h2 className="text-lg font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] mb-6">
                            💬 Reviews ({MOCK_REVIEWS.length + 86})
                        </h2>
                        <div className="space-y-4">
                            {MOCK_REVIEWS.map((review) => (
                                <div key={review.id} className="flex gap-3 pb-4 border-b border-gray-100 dark:border-[#2a2d34] last:border-0">
                                    <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600 flex-shrink-0">
                                        {review.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-text-primary dark:text-white">{review.user}</span>
                                            <div className="flex">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <span className="text-xs text-text-muted">{review.time}</span>
                                        </div>
                                        <p className="text-sm text-text-secondary dark:text-gray-300">{review.text}</p>
                                        <button className="text-xs text-text-muted hover:text-primary mt-1">👍 {review.helpful} helpful</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:w-80 space-y-6">
                    {/* Live Map */}
                    <GeoapifyMap
                        center={{ lat: spot.coordinates.lat, lng: spot.coordinates.lng }}
                        zoom={16}
                        markers={[{
                            lat: spot.coordinates.lat,
                            lng: spot.coordinates.lng,
                            title: spot.placeName,
                            description: `${spot.dishCategory} • ${spot.priceRange}`,
                            emoji: "🍜",
                        }]}
                        height="250px"
                    />

                    {/* Similar Spots */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-5 border border-border dark:border-[#2a2d34]">
                        <h3 className="text-base font-extrabold text-text-primary dark:text-white font-[family-name:var(--font-heading)] mb-4">
                            📍 Similar Spots Nearby
                        </h3>
                        <div className="space-y-3">
                            {similarSpots.map((s) => (
                                <Link key={s.id} href={`/food/${s.id}`} className="flex gap-3 group">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#2a2d34] flex-shrink-0 relative">
                                        <Image src={s.image} alt={s.placeName} fill className="object-cover" sizes="56px" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-primary dark:text-white truncate group-hover:text-primary">{s.placeName}</p>
                                        <p className="text-xs text-text-muted">{s.area} • ⭐ {s.averageRating}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Add Food Spot CTA */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl p-5 border border-orange-200 dark:border-orange-800/30">
                        <h3 className="text-base font-extrabold text-orange-800 dark:text-orange-300 mb-2">
                            🍜 Know a better spot?
                        </h3>
                        <p className="text-sm text-orange-600 dark:text-orange-400 mb-4">
                            Help the community discover hidden gems!
                        </p>
                        <Link href="/post/new" className="block w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-semibold text-sm text-center hover:bg-[#E64A19] transition-colors">
                            Add Food Spot
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
