import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import Navbar from "./Navbar";
import { useProfileContext } from "../context/ProfileContext";

/**
 * Wraps the main app pages: enforces profile completion, then renders navbar.
 * Incomplete profile -> forced to /update_profile.
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