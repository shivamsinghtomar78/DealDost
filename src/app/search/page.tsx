"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchPost {
    _id: string;
    type: string;
    title: string;
    description: string;
    upvotes: number;
    createdAt: string;
}

export default function SearchPage() {
    const [query, setQuery] = useState(() => {
        if (typeof window === "undefined") return "";
        return new URLSearchParams(window.location.search).get("q") ?? "";
    });
    const [results, setResults] = useState<SearchPost[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            return;
        }

        let active = true;
        const controller = new AbortController();

        const runSearch = async () => {
            setLoading(true);
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                cache: "no-store",
                signal: controller.signal,
            });

            if (!active) return;

            if (res.ok) {
                const json = (await res.json()) as { results?: SearchPost[] };
                setResults(json.results ?? []);
            } else {
                setResults([]);
            }
            setLoading(false);
        };

        runSearch().catch(() => {
            if (!active) return;
            setLoading(false);
            setResults([]);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [query]);

    const visibleResults = useMemo(
        () => (query.trim() ? results : []),
        [query, results]
    );

    const empty = useMemo(
        () => !loading && query.trim() && visibleResults.length === 0,
        [loading, query, visibleResults.length]
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
            <div>
                <h1 className="text-2xl font-extrabold text-text-primary dark:text-white">Search</h1>
                <p className="text-sm text-text-secondary">Find deals, food spots, and neighbourhood posts</p>
            </div>

            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by keyword"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-[#1e2028] dark:border-[#2a2d34] text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {loading && <p className="text-sm text-text-secondary">Searching...</p>}

            {empty && (
                <div className="rounded-xl border border-border p-5 bg-white dark:bg-[#1e2028]">
                    <p className="font-semibold text-text-primary dark:text-white">No results found</p>
                    <p className="text-sm text-text-secondary mt-1">Try broader keywords.</p>
                </div>
            )}

            <div className="space-y-3">
                {visibleResults.map((result) => (
                    <Link
                        key={result._id}
                        href={result.type === "deal" ? `/deals/${result._id}` : result.type === "food_spot" ? `/food/${result._id}` : "/neighbourhood"}
                        className="block rounded-xl border border-border p-4 bg-white dark:bg-[#1e2028] hover:border-primary/40 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-3 mb-1">
                            <p className="font-bold text-text-primary dark:text-white">{result.title}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{result.type}</span>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2">{result.description}</p>
                        <p className="text-xs text-text-muted mt-2">{result.upvotes} upvotes</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
