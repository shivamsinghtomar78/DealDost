"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Flame, MapPin } from "lucide-react";

interface PublicUser {
    _id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    city?: string;
    area?: string;
    karmaPoints?: number;
    postsCount?: number;
    totalUpvotes?: number;
    badges?: string[];
}

export default function PublicProfilePage() {
    const params = useParams<{ username: string }>();
    const username = decodeURIComponent(params.username ?? "");
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadUser = async () => {
            setLoading(true);
            const res = await fetch(`/api/users?username=${encodeURIComponent(username)}`, {
                cache: "no-store",
            });

            if (!active) return;
            if (res.ok) {
                const json = (await res.json()) as { user?: PublicUser };
                setUser(json.user ?? null);
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        loadUser().catch(() => {
            if (!active) return;
            setUser(null);
            setLoading(false);
        });

        return () => {
            active = false;
        };
    }, [username]);

    if (loading) {
        return <div className="max-w-3xl mx-auto px-4 py-6 text-sm text-text-secondary">Loading profile...</div>;
    }

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
                <p className="text-lg font-bold text-text-primary dark:text-white">User not found</p>
                <Link href="/leaderboard" className="text-primary text-sm font-semibold">
                    Go to leaderboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-6 border border-border dark:border-[#2a2d34]">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-text-primary dark:text-white">{user.name}</h1>
                        <p className="text-sm text-text-muted">@{user.username}</p>
                        <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {user.area || "Area"} {user.city ? `, ${user.city}` : ""}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border p-4 bg-white dark:bg-[#1e2028]">
                    <p className="text-xs text-text-muted">Posts</p>
                    <p className="text-xl font-bold text-text-primary dark:text-white">{user.postsCount ?? 0}</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-white dark:bg-[#1e2028]">
                    <p className="text-xs text-text-muted">Upvotes</p>
                    <p className="text-xl font-bold text-primary">{user.totalUpvotes ?? 0}</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-white dark:bg-[#1e2028]">
                    <p className="text-xs text-text-muted">Karma</p>
                    <p className="text-xl font-bold text-accent-green">{user.karmaPoints ?? 0}</p>
                </div>
            </div>

            <div className="rounded-xl border border-border p-4 bg-white dark:bg-[#1e2028]">
                <p className="text-sm font-semibold text-text-primary dark:text-white mb-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                    {(user.badges ?? []).length === 0 ? (
                        <p className="text-sm text-text-muted">No badges yet</p>
                    ) : (
                        (user.badges ?? []).map((badge) => (
                            <span key={badge} className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                <Flame className="w-3 h-3 inline mr-1" />
                                {badge}
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
