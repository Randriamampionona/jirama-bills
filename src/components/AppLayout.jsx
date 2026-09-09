import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { T } from "../i18n/translations";
import { useProfileContext } from "../context/ProfileContext";
import Navbar from "./Navbar";
import Loading from "./Loading";

/**
 * Main app shell. Never redirects while the profile is still loading; only a
 * confirmed-incomplete profile is sent to /update_profile.
 */
export default function AppLayout() {
  const { lang, setLang } = useOutletContext();
  const { complete, loading } = useProfileContext();

  if (loading) return <Loading label={T[lang].loadingAuth} />;
  if (!complete) return <Navigate to="/update_profile" replace />;

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <Outlet context={{ lang, setLang }} />
    </>
  );
}