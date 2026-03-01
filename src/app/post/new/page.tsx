"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLATFORMS, DISH_CATEGORIES } from "@/lib/mock-data";
import { DEAL_CATEGORIES } from "@/lib/utils";
import { PlusCircle, ShoppingCart, UtensilsCrossed, Calendar, Image as ImageIcon, Link as LinkIcon, MapPin, Clock, Tag, IndianRupee } from "lucide-react";

type PostType = "deal" | "food_spot" | "event";

const POST_TYPES = [
    { id: "deal" as PostType, label: "🛒 Deal", desc: "Share an online deal", icon: ShoppingCart, color: "from-primary to-primary-light" },
    { id: "food_spot" as PostType, label: "🍜 Food Spot", desc: "Recommend a food place", icon: UtensilsCrossed, color: "from-orange-400 to-orange-600" },
    { id: "event" as PostType, label: "📍 Event / Post", desc: "Post an event or update", icon: Calendar, color: "from-secondary to-secondary-light" },
];

export default function PostNewPage() {
    const [type, setType] = useState<PostType | null>(null);

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <PlusCircle className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        Create Post
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">Share a deal, food spot, or event with your community</p>
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {POST_TYPES.map((pt) => (
                    <button
                        key={pt.id}
                        onClick={() => setType(pt.id)}
                        className={cn(
                            "relative p-5 rounded-2xl border-2 transition-all text-left group",
                            type === pt.id
                                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10"
                                : "border-border dark:border-[#2a2d34] hover:border-primary/40 bg-white dark:bg-[#1e2028]"
                        )}
                    >
                        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3", pt.color)}>
                            <pt.icon className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-text-primary dark:text-white">{pt.label}</p>
                        <p className="text-xs text-text-muted mt-0.5">{pt.desc}</p>
                        {type === pt.id && <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary" />}
                    </button>
                ))}
            </div>

            {/* Deal Form */}
            {type === "deal" && (
                <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34] space-y-4">
                    <h2 className="font-bold text-lg">🛒 Post a Deal</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Product Title</label>
                            <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="e.g. Amul Butter 500g — Fresh Stock!" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Platform</label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.filter((p) => p.name !== "All").map((p) => (
                                    <button key={p.name} className="px-3 py-1.5 rounded-full border border-border dark:border-[#3a3d44] text-sm font-medium hover:border-primary/50 transition-all" style={{ borderColor: "transparent" }}>
                                        <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 inline" /> Original Price
                                </label>
                                <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="₹120" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 inline" /> Deal Price
                                </label>
                                <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="₹89" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                <LinkIcon className="w-3.5 h-3.5 inline" /> Deal Link
                            </label>
                            <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                <Tag className="w-3.5 h-3.5 inline" /> Category
                            </label>
                            <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none text-sm">
                                {DEAL_CATEGORIES.filter((c) => c !== "All").map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                <Clock className="w-3.5 h-3.5 inline" /> Expires At
                            </label>
                            <input type="datetime-local" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                <ImageIcon className="w-3.5 h-3.5 inline" /> Product Screenshot
                            </label>
                            <div className="w-full h-32 border-2 border-dashed border-border dark:border-[#3a3d44] rounded-xl flex items-center justify-center text-text-muted cursor-pointer hover:border-primary/50 transition-colors">
                                <div className="text-center">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Drop image or click to upload</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Description</label>
                            <textarea rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" placeholder="Why is this a great deal? Add details..." />
                        </div>
                        <button className="w-full py-3 rounded-xl font-bold text-white gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 text-sm">
                            🚀 Post Deal
                        </button>
                    </div>
                </div>
            )}

            {/* Food Spot Form */}
            {type === "food_spot" && (
                <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34] space-y-4">
                    <h2 className="font-bold text-lg">🍜 Recommend a Food Spot</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Place Name</label>
                            <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="e.g. Dolma Aunty Momos" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Dish Name</label>
                            <div className="flex flex-wrap gap-2">
                                {DISH_CATEGORIES.filter((d) => d.name !== "All").map((d) => (
                                    <button key={d.name} className="px-3 py-1.5 rounded-full border border-border dark:border-[#3a3d44] text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all">
                                        {d.emoji} {d.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 inline" /> Price Range
                                </label>
                                <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="₹40-₹80" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                    <Clock className="w-3.5 h-3.5 inline" /> Timing
                                </label>
                                <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="11 AM - 10 PM" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                    <MapPin className="w-3.5 h-3.5 inline" /> Area
                                </label>
                                <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Karol Bagh" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">City</label>
                                <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Delhi" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Landmark</label>
                            <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Near Kamla Nagar Market" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                <ImageIcon className="w-3.5 h-3.5 inline" /> Food Photo
                            </label>
                            <div className="w-full h-32 border-2 border-dashed border-border dark:border-[#3a3d44] rounded-xl flex items-center justify-center text-text-muted cursor-pointer hover:border-primary/50 transition-colors">
                                <div className="text-center">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Drop photo or click to upload</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">What makes it special?</label>
                            <textarea rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" placeholder="Tell us about the taste, ambiance, speciality..." />
                        </div>
                        <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 text-sm">
                            🍜 Post Food Spot
                        </button>
                    </div>
                </div>
            )}

            {/* Event Form */}
            {type === "event" && (
                <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34] space-y-4">
                    <h2 className="font-bold text-lg">📍 Post Event / Update</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Title</label>
                            <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="e.g. Garba Night at Connaught Place" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Date & Time</label>
                            <input type="datetime-local" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                <MapPin className="w-3.5 h-3.5 inline" /> Venue
                            </label>
                            <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Central Park, Connaught Place" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Entry Fee</label>
                            <input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Free Entry or ₹200" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">Description</label>
                            <textarea rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2a2d34] border border-border dark:border-[#3a3d44] outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" placeholder="What's the event about?" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-primary dark:text-white block mb-1.5">
                                <ImageIcon className="w-3.5 h-3.5 inline" /> Event Poster
                            </label>
                            <div className="w-full h-32 border-2 border-dashed border-border dark:border-[#3a3d44] rounded-xl flex items-center justify-center text-text-muted cursor-pointer hover:border-primary/50 transition-colors">
                                <div className="text-center">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Drop image or click</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-secondary to-secondary-light hover:opacity-90 transition-opacity shadow-lg shadow-secondary/25 text-sm">
                            📍 Post Event
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
