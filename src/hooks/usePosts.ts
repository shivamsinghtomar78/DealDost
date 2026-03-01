"use client";

import { useEffect, useMemo, useState } from "react";

type PostType = "deal" | "food_spot" | "event" | "lost_found" | "service" | "alert" | "all";

interface UsePostsOptions {
    type?: PostType;
    city?: string;
    area?: string;
    platform?: string;
    search?: string;
    limit?: number;
}

interface PostRecord {
    _id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
    upvotes: number;
}

export function usePosts(options: UsePostsOptions = {}) {
    const [posts, setPosts] = useState<PostRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const query = useMemo(() => {
        const params = new URLSearchParams();
        if (options.type && options.type !== "all") params.set("type", options.type);
        if (options.city) params.set("city", options.city);
        if (options.area) params.set("area", options.area);
        if (options.platform) params.set("platform", options.platform);
        if (options.search) params.set("search", options.search);
        params.set("limit", String(options.limit ?? 12));
        params.set("page", String(page));
        return params.toString();
    }, [options.type, options.city, options.area, options.platform, options.search, options.limit, page]);

    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        const loadPosts = async () => {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/posts?${query}`, {
                cache: "no-store",
                signal: controller.signal,
            });

            if (!active) return;

            if (!response.ok) {
                setError("Failed to fetch posts");
                setLoading(false);
                return;
            }

            const json = (await response.json()) as {
                posts?: PostRecord[];
                pagination?: { totalPages?: number };
            };

            const nextPosts = json.posts ?? [];
            setPosts((current) => (page === 1 ? nextPosts : [...current, ...nextPosts]));
            setHasMore((json.pagination?.totalPages ?? 1) > page);
            setLoading(false);
        };

        loadPosts().catch(() => {
            if (!active) return;
            setError("Failed to fetch posts");
            setLoading(false);
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [query, page]);

    const reset = () => {
        setPage(1);
        setPosts([]);
        setHasMore(true);
    };

    const fetchNextPage = () => {
        if (!loading && hasMore) {
            setPage((current) => current + 1);
        }
    };

    return { posts, loading, error, hasMore, page, setPage, fetchNextPage, reset };
}

export default usePosts;
