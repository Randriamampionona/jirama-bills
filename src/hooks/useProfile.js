import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Live subscription to the signed-in user's Firestore profile.
 * complete = has both household_ref and no_person (drives onboarding gate).
 * @param {boolean} ready  true when Firebase auth is live
 */
export function useProfile(ready) {
  const { isSignedIn, user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady) { setLoading(false); return; }
    if (!ready || !isSignedIn || !user) return;
    const unsub = onSnapshot(
      doc(db, "users", user.id),
      (snap) => {
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      },
      (e) => { console.error("profile listen:", e); setLoading(false); }
    );
    return unsub;
  }, [ready, isSignedIn, user]);

  const complete = !!(
    profile &&
    profile.household_ref &&
    profile.no_person != null &&
    profile.no_person !== ""
  );

  return { profile, loading, complete };
}