"use client";

import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface UseAuthState {
    user: User | null;
    loading: boolean;
}

export function useAuth(): UseAuthState {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}

export default useAuth;
