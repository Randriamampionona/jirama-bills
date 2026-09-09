import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { T } from "../i18n/translations";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useSyncUser } from "../hooks/useSyncUser";
import { useProfile } from "../hooks/useProfile";
import { ensureCurrentMonthBills } from "../lib/bills";
import { ProfileContext } from "../context/ProfileContext";
import Loading from "./Loading";

// Completeness read straight from the Clerk session (synchronous, no DB wait).
function completeFromClerk(user) {
  const m = user?.unsafeMetadata || {};
  return Boolean(m.household_ref && m.no_person != null && m.no_person !== "");
}
function completeFromProfile(p) {
  return Boolean(p && p.household_ref && p.no_person != null && p.no_person !== "");
}

/**
 * The onboarding decision is made from Clerk's session metadata, which is
 * available the moment Clerk loads — so a completed user is routed to /indexing
 * with no Firestore round-trip and no flash through /update_profile.
 *
 * Firestore is only consulted for legacy users whose Clerk metadata isn't set
 * yet; those are transparently backfilled so it's a one-time cost per user.
 */
export default function AuthGate({ lang, setLang }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const fbReady = useFirebaseAuth();
  useSyncUser(fbReady);
  const { profile, loading } = useProfile(fbReady);

  const clerkComplete = completeFromClerk(user);
  const complete = clerkComplete || completeFromProfile(profile);
  // Wait on Firestore ONLY when Clerk metadata can't already decide (legacy users).
  const decisionReady = clerkComplete || !loading;

  // One-time migration: copy a legacy Firestore-complete profile into Clerk metadata.
  useEffect(() => {
    if (!user || clerkComplete) return;
    if (completeFromProfile(profile)) {
      user
        .update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            household_ref: profile.household_ref,
            no_person: profile.no_person,
          },
        })
        .catch((e) => console.error("metadata backfill failed:", e));
    }
  }, [user, clerkComplete, profile]);

  useEffect(() => {
    if (isSignedIn && fbReady) {
      ensureCurrentMonthBills().catch((e) => console.error("ensureCurrentMonthBills:", e));
    }
  }, [isSignedIn, fbReady]);

  if (!isLoaded) return <Loading label={T[lang].loadingAuth} />;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  // fbReady: data listeners need auth. decisionReady: don't route on unknown completeness.
  if (!fbReady || !decisionReady) return <Loading label={T[lang].loadingAuth} />;

  return (
    <ProfileContext.Provider value={{ profile, complete, loading, fbReady }}>
      <Outlet context={{ lang, setLang }} />
    </ProfileContext.Provider>
  );
}