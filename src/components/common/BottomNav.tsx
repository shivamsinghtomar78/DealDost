"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, UtensilsCrossed, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/deals", label: "Deals", icon: ShoppingCart },
    { href: "/food", label: "Food", icon: UtensilsCrossed },
    { href: "/neighbourhood", label: "Local", icon: MapPin },
    { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    if (!user) return null;

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#1a1d24]/90 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href ||
                        (tab.href !== "/" && pathname.startsWith(tab.href));
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative",
                                isActive ? "text-primary" : "text-text-muted hover:text-text-secondary"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute -top-1 w-8 h-1 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <tab.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                            <span className="text-[10px] font-semibold">{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
