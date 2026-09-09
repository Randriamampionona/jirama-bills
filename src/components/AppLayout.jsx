import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useProfileContext } from "../context/ProfileContext";
import Navbar from "./Navbar";

/**
 * Completeness is already resolved by AuthGate (from the Clerk session), so this
 * is a synchronous decision — no loading state, no flicker.
 */
export default function AppLayout() {
  const { lang, setLang } = useOutletContext();
  const { complete } = useProfileContext();

  if (!complete) return <Navigate to="/update_profile" replace />;

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <Outlet context={{ lang, setLang }} />
    </>
  );
}