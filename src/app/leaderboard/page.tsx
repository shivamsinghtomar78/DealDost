"use client";

import { MOCK_DEALS } from "@/lib/mock-data";
import { Trophy, Medal, Flame, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const leaderboard = MOCK_DEALS.map((d) => d.postedBy)
    .filter((u, i, arr) => arr.findIndex((a) => a.username === u.username) === i)
    .map((user, i) => ({
        ...user,
        rank: i + 1,
        upvotes: Math.floor(Math.random() * 500) + 200,
        posts: Math.floor(Math.random() * 30) + 5,
        badge: i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`,
    }));

export default function LeaderboardPage() {
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

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-3">
                {leaderboard.slice(0, 3).map((user, i) => (
                    <div
                        key={user.username}
                        className={cn(
                            "bg-white dark:bg-[#1e2028] rounded-2xl p-5 border text-center",
                            i === 0
                                ? "border-yellow-300 shadow-lg shadow-yellow-100/50 dark:shadow-yellow-900/20 ring-2 ring-yellow-200"
                                : "border-border dark:border-[#2a2d34]"
                        )}
                    >
                        <div className="text-3xl mb-2">{user.badge}</div>
                        <div className={cn(
                            "w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-xl font-extrabold",
                            i === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 ring-4 ring-yellow-200" :
                                i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                    "bg-gradient-to-br from-orange-300 to-orange-500"
                        )}>
                            {user.name.charAt(0)}
                        </div>
                        <p className="font-bold text-sm mt-2 text-text-primary dark:text-white">{user.name}</p>
                        <p className="text-xs text-text-muted">@{user.username}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <Flame className="w-3.5 h-3.5 text-primary" />
                            <span className="text-sm font-bold text-primary">{user.upvotes}</span>
                        </div>
                        <p className="text-[10px] text-text-muted">{user.posts} posts</p>
                    </div>
                ))}
            </div>

            {/* Rest of leaderboard */}
            <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-border dark:border-[#2a2d34] overflow-hidden">
                {leaderboard.slice(3).map((user, i) => (
                    <div
                        key={user.username}
                        className="flex items-center gap-4 px-5 py-4 border-b border-border dark:border-[#2a2d34] last:border-0 hover:bg-gray-50 dark:hover:bg-[#2a2d34] transition-colors"
                    >
                        <span className="text-sm font-bold text-text-muted w-8 text-center">{user.badge}</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-text-primary dark:text-white">{user.name}</p>
                            <p className="text-xs text-text-muted">@{user.username} • {user.posts} posts</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-primary" />
                            <span className="font-bold text-primary">{user.upvotes}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
