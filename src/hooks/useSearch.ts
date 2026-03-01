"use client";

import { useEffect, useMemo, useState } from "react";

interface SearchResult {
    _id: string;
    type: string;
    title: string;
    description: string;
}

export function useSearch(initialQuery = "", delayMs = 300) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const normalizedQuery = useMemo(() => query.trim(), [query]);

    useEffect(() => {
        if (!normalizedQuery) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`, {
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Search request failed");
                }

                const json = (await response.json()) as { results?: SearchResult[] };
                setResults(json.results ?? []);
            } catch (searchError) {
                setError(searchError instanceof Error ? searchError.message : "Search failed");
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, delayMs);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [normalizedQuery, delayMs]);

    return { query, setQuery, results, loading, error };
}

export default useSearch;
