import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth as fbAuth, firebaseReady } from "../config/firebase";

/**
 * Clerk removed its native Firebase integration, so we no longer exchange a
 * Clerk token for a Firebase session. Instead we sign Firebase in anonymously
 * so Firestore rules can require request.auth != null. Who the *Clerk* user is
 * still comes from useUser() (we key docs by the Clerk id); Firebase auth here
 * only proves "a real app session", not the specific identity.
 * Returns true once Firebase is ready to use.
 */
export function useFirebaseAuth() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!firebaseReady) { setReady(true); return; }
    const unsub = onAuthStateChanged(fbAuth, (u) => {
      if (u) {
        setReady(true);
      } else {
        signInAnonymously(fbAuth).catch((e) => {
          console.error("Firebase anonymous sign-in failed:", e);
          setReady(true); // don't hang the UI; writes will surface a clear error
        });
      }
    });
    return unsub;
  }, []);

  return ready;
}