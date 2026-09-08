import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Registers / updates the signed-in Clerk user in Firestore's `users`
 * collection — straight from the browser, no server or webhook needed.
 *
 * Runs once Firebase auth is live (so the write passes the rules). Because we
 * write users/{clerkUserId} and the Clerk<->Firebase token sets auth.uid to the
 * same id, the rule "you may only write your own doc" holds.
 *
 * @param {boolean} ready  true when useFirebaseAuth has signed Firebase in
 */
export function useSyncUser(ready) {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!firebaseReady || !ready || !isSignedIn || !user) return;

    const email = user.primaryEmailAddress?.emailAddress || null;
    setDoc(
      doc(db, "users", user.id),
      {
        clerkId: user.id,
        email,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ).catch((e) => console.error("user sync failed:", e));
  }, [ready, isSignedIn, user]);
}
