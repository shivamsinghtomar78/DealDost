"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapMarker {
    lat: number;
    lng: number;
    title: string;
    description?: string;
    emoji?: string;
}

interface GeoapifyMapProps {
    center: { lat: number; lng: number };
    zoom?: number;
    markers?: MapMarker[];
    height?: string;
    className?: string;
    showNavButton?: boolean;
}

// Fix Leaflet default marker icon issue in Next.js
const createIcon = (emoji: string = "ðŸ“") => {
    return L.divIcon({
        className: "geoapify-marker",
        html: `<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); cursor: pointer;">${emoji}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

export default function GeoapifyMap({
    center,
    zoom = 15,
    markers = [],
    height = "300px",
    className = "",
    showNavButton = true,
}: GeoapifyMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
        if (!apiKey) {
            console.error("Geoapify API key not found");
            return;
        }

        // Initialize map
        const map = L.map(mapRef.current, {
            scrollWheelZoom: false,
        }).setView([center.lat, center.lng], zoom);

        // Geoapify raster tiles
        const isRetina = L.Browser.retina;
        const baseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`;
        const retinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${apiKey}`;

        L.tileLayer(isRetina ? retinaUrl : baseUrl, {
            attribution:
                'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">Â© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">Â© OpenStreetMap</a>',
            maxZoom: 20,
        }).addTo(map);

        // Add markers
        if (markers.length > 0) {
            markers.forEach((m) => {
                const icon = createIcon(m.emoji || "ðŸ“");
                const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

                if (m.title) {
                    marker.bindPopup(
                        `<div style="font-family: 'Inter', sans-serif; min-width: 150px;">
                            <strong style="font-size: 14px;">${m.title}</strong>
                            ${m.description ? `<br/><span style="font-size: 12px; color: #666;">${m.description}</span>` : ""}
                        </div>`
                    );
                }
            });
        } else {
            // Single center marker
            const icon = createIcon("ðŸ“");
            L.marker([center.lat, center.lng], { icon }).addTo(map);
        }

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [center.lat, center.lng, zoom, markers]);

    const openInMaps = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`,
            "_blank"
        );
    };

    return (
        <div className={`rounded-2xl overflow-hidden border border-border dark:border-[#2a2d34] ${className}`}>
            <div ref={mapRef} style={{ height, width: "100%" }} />
            {showNavButton && (
                <div className="bg-white dark:bg-[#1e2028] p-3">
                    <button
                        onClick={openInMaps}
                        className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        ðŸ§­ Get Directions
                    </button>
                </div>
            )}
        </div>
    );
}
