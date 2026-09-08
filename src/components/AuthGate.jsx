import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { T } from "../i18n/translations";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useSyncUser } from "../hooks/useSyncUser";
import { useProfile } from "../hooks/useProfile";
import { ensureCurrentMonthBills } from "../lib/bills";
import { ProfileContext } from "../context/ProfileContext";

/**
 * Top-level guard for every authenticated route.
 * - requires a Clerk session (else -> /login)
 * - signs Firebase in via Clerk token
 * - registers the user in Firestore
 * - ensures this month's bills exist
 * - exposes the live profile through ProfileContext
 * Renders NO navbar (onboarding lives here too). AppLayout adds the navbar.
 */
export default function AuthGate({ lang, setLang }) {
  const { isLoaded, isSignedIn } = useAuth();
  const fbReady = useFirebaseAuth();
  useSyncUser(fbReady);
  const { profile, complete, loading } = useProfile(fbReady);

  useEffect(() => {
    if (isSignedIn && fbReady) {
      ensureCurrentMonthBills().catch((e) => console.error("ensureCurrentMonthBills:", e));
    }
  }, [isSignedIn, fbReady]);

  if (!isLoaded || (isSignedIn && (!fbReady || loading))) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        {T[lang].loadingAuth}
      </div>
    );
  }
  if (!isSignedIn) return <Navigate to="/login" replace />;

  return (
    <ProfileContext.Provider value={{ profile, complete, loading }}>
      <Outlet context={{ lang, setLang }} />
    </ProfileContext.Provider>
  );
}