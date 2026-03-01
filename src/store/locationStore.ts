"use client";

import { create } from "zustand";

interface LocationState {
    city: string;
    area: string;
    latitude: number | null;
    longitude: number | null;
    radiusKm: number;
    setCity: (city: string) => void;
    setArea: (area: string) => void;
    setCoordinates: (latitude: number | null, longitude: number | null) => void;
    setRadiusKm: (radiusKm: number) => void;
    resetLocation: () => void;
}

const initialState = {
    city: "Delhi",
    area: "Karol Bagh",
    latitude: null,
    longitude: null,
    radiusKm: 5,
};

export const useLocationStore = create<LocationState>((set) => ({
    ...initialState,
    setCity: (city) => set({ city }),
    setArea: (area) => set({ area }),
    setCoordinates: (latitude, longitude) => set({ latitude, longitude }),
    setRadiusKm: (radiusKm) => set({ radiusKm }),
    resetLocation: () => set(initialState),
}));
