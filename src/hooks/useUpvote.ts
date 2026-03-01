"use client";

import { useState } from "react";

interface UseUpvoteOptions {
    postId: string;
    initialUpvotes: number;
    userId: string;
}

export function useUpvote({ postId, initialUpvotes, userId }: UseUpvoteOptions) {
    const [count, setCount] = useState(initialUpvotes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleUpvote = async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/posts/${postId}/upvote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error("Failed to toggle upvote");
            }

            const json = (await response.json()) as { post?: { upvotes?: number } };
            if (typeof json.post?.upvotes === "number") {
                setCount(json.post.upvotes);
            }
        } catch (upvoteError) {
            setError(upvoteError instanceof Error ? upvoteError.message : "Failed to toggle upvote");
        } finally {
            setLoading(false);
        }
    };

    return { count, loading, error, toggleUpvote };
}

export default useUpvote;
