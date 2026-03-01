"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, ShoppingCart, UtensilsCrossed, MapPin, Flame,
    PlusCircle, User, TrendingUp, Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/deals", label: "Deals", icon: ShoppingCart },
    { href: "/food", label: "Food Spots", icon: UtensilsCrossed },
    { href: "/neighbourhood", label: "Neighbourhood", icon: MapPin },
    { href: "/trending", label: "Trending", icon: Flame },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore();

    return (
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-[#1a1d24] border-r border-border overflow-y-auto z-40">
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary dark:bg-primary/20 shadow-sm"
                                    : "text-text-secondary hover:bg-gray-100 dark:hover:bg-[#2a2d34] hover:text-text-primary dark:hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn("w-5 h-5", isActive && "text-primary")}
                            />
                            {item.label}
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}

                {/* Post New CTA */}
                <Link
                    href="/post/new"
                    className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-sm font-bold text-white gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                >
                    <PlusCircle className="w-5 h-5" />
                    Post New Deal
                </Link>
            </nav>

            {/* Divider */}
            <div className="mx-4 border-t border-border" />

            {/* Savings Card */}
            <div className="p-4">
                <div className="bg-gradient-to-br from-accent-green/10 to-accent-green/5 dark:from-accent-green/20 dark:to-accent-green/10 rounded-2xl p-4 border border-accent-green/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-accent-green" />
                        <span className="text-xs font-semibold text-accent-green uppercase tracking-wide">Your Savings</span>
                    </div>
                    <p className="text-2xl font-extrabold text-accent-green font-[family-name:var(--font-heading)]">
                        ₹{user?.totalSaved?.toLocaleString("en-IN") || "0"}
                    </p>
                    <p className="text-xs text-text-muted mt-1">saved this month via DealDost</p>
                </div>
            </div>

            {/* Bottom Links */}
            <div className="p-4 pt-0 space-y-1 mb-4">
                <Link
                    href="/profile"
                    className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors",
                        pathname === "/profile"
                            ? "bg-primary/10 text-primary"
                            : "text-text-secondary hover:bg-gray-100 dark:hover:bg-[#2a2d34]"
                    )}
                >
                    <User className="w-4 h-4" />
                    Profile
                </Link>
                <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-gray-100 dark:hover:bg-[#2a2d34] transition-colors"
                >
                    <Bookmark className="w-4 h-4" />
                    Saved Items
                </Link>
            </div>
        </aside>
    );
}
