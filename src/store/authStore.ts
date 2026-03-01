"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppUser } from "@/lib/types";

interface AuthState {
    user: AppUser | null;
    isLoggedIn: boolean;
    savedDeals: string[];
    savedFoodSpots: string[];
    upvotedPosts: string[];

    setUser: (user: AppUser | null) => void;
    login: (user: AppUser) => void;
    logout: () => void;
    toggleSaveDeal: (dealId: string) => void;
    toggleSaveFoodSpot: (spotId: string) => void;
    toggleUpvote: (postId: string) => void;
    isSaved: (id: string) => boolean;
    isUpvoted: (id: string) => boolean;
}

const initialState = {
    user: null as AppUser | null,
    isLoggedIn: false,
    savedDeals: [] as string[],
    savedFoodSpots: [] as string[],
    upvotedPosts: [] as string[],
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setUser: (user) =>
                set({
                    user,
                    isLoggedIn: Boolean(user),
                    savedDeals: user?.savedDeals ?? [],
                    savedFoodSpots: user?.savedFoodSpots ?? [],
                }),

            login: (user) =>
                set({
                    user,
                    isLoggedIn: true,
                    savedDeals: user.savedDeals ?? [],
                    savedFoodSpots: user.savedFoodSpots ?? [],
                }),

            logout: () => set(initialState),

            toggleSaveDeal: (dealId) =>
                set((state) => ({
                    savedDeals: state.savedDeals.includes(dealId)
                        ? state.savedDeals.filter((id) => id !== dealId)
                        : [...state.savedDeals, dealId],
                })),

            toggleSaveFoodSpot: (spotId) =>
                set((state) => ({
                    savedFoodSpots: state.savedFoodSpots.includes(spotId)
                        ? state.savedFoodSpots.filter((id) => id !== spotId)
                        : [...state.savedFoodSpots, spotId],
                })),

            toggleUpvote: (postId) =>
                set((state) => ({
                    upvotedPosts: state.upvotedPosts.includes(postId)
                        ? state.upvotedPosts.filter((id) => id !== postId)
                        : [...state.upvotedPosts, postId],
                })),

            isSaved: (id) => {
                const state = get();
                return state.savedDeals.includes(id) || state.savedFoodSpots.includes(id);
            },

            isUpvoted: (id) => get().upvotedPosts.includes(id),
        }),
        {
            name: "dealdost-auth",
            partialize: (state) => ({
                user: state.user,
                isLoggedIn: state.isLoggedIn,
                savedDeals: state.savedDeals,
                savedFoodSpots: state.savedFoodSpots,
                upvotedPosts: state.upvotedPosts,
            }),
        }
    )
);
