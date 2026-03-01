"use client";

import { create } from "zustand";

interface FilterState {
    platform: string;
    category: string;
    dish: string;
    area: string;
    city: string;
    sortBy: string;
    discountMin: number;
    showExpiringSoon: boolean;
    priceRange: string;
    spotType: string;
    ratingMin: number;
    nearMe: boolean;
    searchQuery: string;
    activeTab: string;

    setPlatform: (p: string) => void;
    setCategory: (c: string) => void;
    setDish: (d: string) => void;
    setArea: (a: string) => void;
    setCity: (c: string) => void;
    setSortBy: (s: string) => void;
    setDiscountMin: (d: number) => void;
    setShowExpiringSoon: (v: boolean) => void;
    setPriceRange: (p: string) => void;
    setSpotType: (t: string) => void;
    setRatingMin: (r: number) => void;
    setNearMe: (v: boolean) => void;
    setSearchQuery: (q: string) => void;
    setActiveTab: (t: string) => void;
    resetFilters: () => void;
}

const initialState = {
    platform: "All",
    category: "All",
    dish: "All",
    area: "All",
    city: "Delhi",
    sortBy: "hot",
    discountMin: 0,
    showExpiringSoon: false,
    priceRange: "All",
    spotType: "All",
    ratingMin: 0,
    nearMe: false,
    searchQuery: "",
    activeTab: "events",
};

export const useFilterStore = create<FilterState>((set) => ({
    ...initialState,
    setPlatform: (platform) => set({ platform }),
    setCategory: (category) => set({ category }),
    setDish: (dish) => set({ dish }),
    setArea: (area) => set({ area }),
    setCity: (city) => set({ city }),
    setSortBy: (sortBy) => set({ sortBy }),
    setDiscountMin: (discountMin) => set({ discountMin }),
    setShowExpiringSoon: (showExpiringSoon) => set({ showExpiringSoon }),
    setPriceRange: (priceRange) => set({ priceRange }),
    setSpotType: (spotType) => set({ spotType }),
    setRatingMin: (ratingMin) => set({ ratingMin }),
    setNearMe: (nearMe) => set({ nearMe }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setActiveTab: (activeTab) => set({ activeTab }),
    resetFilters: () => set(initialState),
}));
