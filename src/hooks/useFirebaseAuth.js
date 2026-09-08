import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { signInWithCustomToken } from "firebase/auth";
import { auth as fbAuth, firebaseReady } from "../config/firebase";

/**
 * Signs the Firebase SDK in as the current Clerk user, using the token minted
 * by Clerk's "integration_firebase" JWT template. This is what populates
 * request.auth in Firestore rules. Returns true once Firebase is ready to use.
 */
export function useFirebaseAuth() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function sync() {
      if (!firebaseReady) { setReady(true); return; } // nothing to sign into
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken({ template: "integration_firebase" });
        if (token) await signInWithCustomToken(fbAuth, token);
      } catch (e) {
        console.error("Firebase sign-in via Clerk failed:", e);
      }
      if (active) setReady(true);
    }
    sync();
    return () => { active = false; };
  }, [isLoaded, isSignedIn, getToken]);

  return ready;
}
