"use client";

import { useEffect, useState } from "react";
import { useLocationStore } from "@/store/locationStore";

interface UseLocationState {
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useLocation(autoRequest = false): UseLocationState {
    const { latitude, longitude, setCoordinates } = useLocationStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported in this browser.");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates(position.coords.latitude, position.coords.longitude);
                setLoading(false);
            },
            (geoError) => {
                setError(geoError.message || "Unable to fetch location");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
    };

    useEffect(() => {
        if (autoRequest) {
            refresh();
        }
        // Intentional one-time bootstrap when autoRequest is true.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRequest]);

    return { latitude, longitude, loading, error, refresh };
}

export default useLocation;
