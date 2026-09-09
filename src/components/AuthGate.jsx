import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { T } from "../i18n/translations";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useSyncUser } from "../hooks/useSyncUser";
import { useProfile } from "../hooks/useProfile";
import { ensureCurrentMonthBills } from "../lib/bills";
import { ProfileContext } from "../context/ProfileContext";
import Loading from "./Loading";

/**
 * Top-level guard for every authenticated route. Renders NOTHING downstream
 * until Clerk auth, Firebase, AND the Firestore profile are all resolved.
 * Because no child route mounts on half-known state, a completed user never
 * flashes through /update_profile on the way to /indexing.
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

  if (!isLoaded) return <Loading label={T[lang].loadingAuth} />;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (!fbReady || loading) return <Loading label={T[lang].loadingAuth} />;

  return (
    <ProfileContext.Provider value={{ profile, complete, loading }}>
      <Outlet context={{ lang, setLang }} />
    </ProfileContext.Provider>
  );
}