"use client";

import Link from "next/link";
import { Search, Bell, Moon, Sun, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

function getInitialTheme() {
    if (typeof window === "undefined") {
        return false;
    }

    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
        return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function Navbar() {
    const [darkMode, setDarkMode] = useState(getInitialTheme);
    const { user } = useAuthStore();
    useAuth();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        window.localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const toggleDark = () => {
        setDarkMode((current) => !current);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-[#1a1d24]/80 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="flex items-center justify-between h-full px-4 lg:px-6 max-w-[1920px] mx-auto">
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <span className="text-xl font-extrabold text-gradient font-[family-name:var(--font-heading)]">
                        DealDost
                    </span>
                </Link>

                <div className="hidden md:flex flex-1 max-w-xl mx-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search deals, food spots, events..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-[#2a2d34] rounded-full text-sm border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-text-muted"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                    <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2a2d34] hover:bg-gray-200 dark:hover:bg-[#3a3d44] transition-colors text-sm">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-text-primary dark:text-white">Delhi</span>
                        <span className="text-text-muted hidden lg:inline">, Karol Bagh</span>
                    </button>

                    <button
                        onClick={toggleDark}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2d34] transition-colors"
                        aria-label="Toggle theme"
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-text-secondary" />
                        )}
                    </button>

                    <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2d34] transition-colors" aria-label="Notifications">
                        <Bell className="w-5 h-5 text-text-secondary dark:text-gray-400" />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-red rounded-full pulse-dot" />
                    </button>

                    <Link href="/profile" className="shrink-0" aria-label="Profile">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-white dark:ring-[#1a1d24] shadow-md">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                    </Link>
                </div>
            </div>

            <div className="md:hidden px-4 pb-3 bg-white dark:bg-[#1a1d24] border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search deals, food, events..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-[#2a2d34] rounded-full text-sm border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                </div>
            </div>
        </nav>
    );
}
