import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { T } from "../i18n/translations";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useSyncUser } from "../hooks/useSyncUser";
import { ensureCurrentMonthBills } from "../lib/bills";
import Navbar from "./Navbar";

export default function ProtectedLayout({ lang, setLang }) {
  const { isLoaded, isSignedIn } = useAuth();
  const fbReady = useFirebaseAuth();

  // 1) register the user in Firestore (client-side, free)
  useSyncUser(fbReady);

  // 2) make sure this month's bill records exist
  useEffect(() => {
    if (isSignedIn && fbReady) {
      ensureCurrentMonthBills().catch((e) => console.error("ensureCurrentMonthBills:", e));
    }
  }, [isSignedIn, fbReady]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        {T[lang].loadingAuth}
      </div>
    );
  }
  if (!isSignedIn) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <Outlet context={{ lang, setLang }} />
    </>
  );
}
