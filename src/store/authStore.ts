"use client";

import { create } from "zustand";
import { MOCK_USER } from "@/lib/mock-data";

interface AuthState {
    user: typeof MOCK_USER | null;
    isLoggedIn: boolean;
    savedDeals: string[];
    savedFoodSpots: string[];
    upvotedPosts: string[];

    login: () => void;
    logout: () => void;
    toggleSaveDeal: (dealId: string) => void;
    toggleSaveFoodSpot: (spotId: string) => void;
    toggleUpvote: (postId: string) => void;
    isSaved: (id: string) => boolean;
    isUpvoted: (id: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: MOCK_USER,
    isLoggedIn: true,
    savedDeals: [...MOCK_USER.savedDeals],
    savedFoodSpots: [...MOCK_USER.savedFoodSpots],
    upvotedPosts: [],

    login: () => set({ user: MOCK_USER, isLoggedIn: true }),
    logout: () => set({ user: null, isLoggedIn: false, savedDeals: [], savedFoodSpots: [], upvotedPosts: [] }),

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
}));
