import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import IndexingPage from "./pages/IndexingPage";
import BillingPage from "./pages/BillingPage";
import ProtectedLayout from "./components/ProtectedLayout";

export default function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("lang");
    return ["en", "fr", "mg"].includes(saved) ? saved : "fr";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500/30">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(6,182,212,0.10), transparent 70%), radial-gradient(50% 40% at 100% 100%, rgba(245,158,11,0.08), transparent 70%)",
        }}
      />
      <div className="relative">
        <Routes>
          <Route path="/login" element={<LoginPage lang={lang} setLang={setLang} />} />
          <Route path="/sign-up" element={<SignUpPage lang={lang} setLang={setLang} />} />

          <Route element={<ProtectedLayout lang={lang} setLang={setLang} />}>
            <Route path="/indexing" element={<IndexingPage />} />
            <Route path="/billing" element={<BillingPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/indexing" replace />} />
        </Routes>
      </div>
    </div>
  );
}
