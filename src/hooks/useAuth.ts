"use client";

import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchUserByUid } from "@/lib/client-api";
import { useAuthStore } from "@/store/authStore";

interface UseAuthState {
    user: User | null;
    loading: boolean;
}

export function useAuth(): UseAuthState {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const setStoreUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
            setUser(nextUser);
            setLoading(false);

            if (nextUser) {
                await fetch("/api/auth/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        firebaseUid: nextUser.uid,
                        email: nextUser.email,
                        name: nextUser.displayName,
                        avatarUrl: nextUser.photoURL,
                    }),
                }).catch(() => {
                    // Non-blocking best-effort sync.
                });

                const profile = await fetchUserByUid(nextUser.uid).catch(() => null);
                if (profile) {
                    setStoreUser(profile);
                }
            } else {
                setStoreUser(null);
            }
        });

        return () => unsubscribe();
    }, [setStoreUser]);

    return { user, loading };
}

export default useAuth;
