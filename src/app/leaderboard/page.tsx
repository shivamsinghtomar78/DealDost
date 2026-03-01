"use client";

import { useEffect, useState } from "react";
import { Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchLeaderboard } from "@/lib/client-api";
import type { AppUser } from "@/lib/types";

interface LeaderboardUser extends AppUser {
    rank: number;
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const load = async () => {
            setLoading(true);
            const leaderboard = await fetchLeaderboard(20, controller.signal);
            if (!active) return;
            setUsers(
                leaderboard.map((user, index) => ({
                    ...user,
                    rank: index + 1,
                }))
            );
            setLoading(false);
        };

        load().catch(() => {
            if (!active) return;
            setUsers([]);
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-text-primary dark:text-white">
                        Weekly Leaderboard
                    </h1>
                </div>
                <p className="text-sm text-text-secondary">Top contributors who help the community save more</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-32 rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] skeleton-shimmer" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] p-6 text-center">
                    <p className="text-lg font-bold text-text-primary dark:text-white">No leaderboard data yet</p>
                    <p className="text-sm text-text-secondary mt-1">Start posting deals and food spots to appear here.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {users.slice(0, 3).map((user, index) => (
                            <div
                                key={user.id || user.username}
                                className={cn(
                                    "bg-white dark:bg-[#1e2028] rounded-2xl p-5 border text-center",
                                    index === 0
                                        ? "border-yellow-300 shadow-lg shadow-yellow-100/50 dark:shadow-yellow-900/20 ring-2 ring-yellow-200"
                                        : "border-border dark:border-[#2a2d34]"
                                )}
                            >
                                <div className="text-sm font-bold text-text-muted mb-2">#{user.rank}</div>
                                <div className={cn(
                                    "w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-xl font-extrabold",
                                    index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 ring-4 ring-yellow-200" :
                                        index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                            "bg-gradient-to-br from-orange-300 to-orange-500"
                                )}>
                                    {user.name?.charAt(0) || "U"}
                                </div>
                                <p className="font-bold text-sm mt-2 text-text-primary dark:text-white">{user.name || "Unknown"}</p>
                                <p className="text-xs text-text-muted">@{user.username || "user"}</p>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    <Flame className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-sm font-bold text-primary">{user.totalUpvotes}</span>
                                </div>
                                <p className="text-[10px] text-text-muted">{user.postsCount} posts</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-border dark:border-[#2a2d34] overflow-hidden">
                        {users.slice(3).map((user) => (
                            <div
                                key={user.id || user.username}
                                className="flex items-center gap-4 px-5 py-4 border-b border-border dark:border-[#2a2d34] last:border-0 hover:bg-gray-50 dark:hover:bg-[#2a2d34] transition-colors"
                            >
                                <span className="text-sm font-bold text-text-muted w-8 text-center">#{user.rank}</span>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.charAt(0) || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-text-primary dark:text-white truncate">{user.name || "Unknown"}</p>
                                    <p className="text-xs text-text-muted truncate">@{user.username || "user"} · {user.postsCount} posts</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Flame className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-primary">{user.totalUpvotes}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
