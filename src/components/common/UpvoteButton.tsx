"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export function UpvoteButton({ postId, initialCount }: { postId: string; initialCount: number }) {
    const { toggleUpvote, isUpvoted } = useAuthStore();
    const upvoted = isUpvoted(postId);
    const [count, setCount] = useState(initialCount);
    const [showBurst, setShowBurst] = useState(false);

    const handleUpvote = () => {
        toggleUpvote(postId);
        if (!upvoted) {
            setCount((c) => c + 1);
            setShowBurst(true);
            setTimeout(() => setShowBurst(false), 600);
        } else {
            setCount((c) => c - 1);
        }
    };

    return (
        <button
            onClick={handleUpvote}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 relative",
                upvoted
                    ? "bg-primary/15 text-primary dark:bg-primary/25"
                    : "bg-gray-100 dark:bg-[#2a2d34] text-text-secondary hover:bg-primary/10 hover:text-primary"
            )}
        >
            <AnimatePresence>
                {showBurst && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-full bg-primary/20"
                    />
                )}
            </AnimatePresence>
            <motion.div
                animate={upvoted ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                <Flame className={cn("w-4 h-4", upvoted && "fill-primary text-primary")} />
            </motion.div>
            <span>{count}</span>
        </button>
    );
}
