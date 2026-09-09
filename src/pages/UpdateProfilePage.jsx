import { useState } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { T } from "../i18n/translations";
import { useProfileContext } from "../context/ProfileContext";
import BrandMark from "../components/BrandMark";
import LangSwitch from "../components/LangSwitch";
import Loading from "../components/Loading";
import ProfileHouseholdFields from "../components/ProfileForm";

/**
 * Onboarding — no navbar. A complete profile is redirected to /indexing BEFORE
 * the form renders; while the profile is still loading we show a spinner, so
 * the household form never flashes for an already-configured user.
 */
export default function UpdateProfilePage() {
  const { lang, setLang } = useOutletContext();
  const t = T[lang];
  const { user } = useUser();
  const { complete, loading } = useProfileContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ household_ref: "", no_person: "" });
  const [saving, setSaving] = useState(false);

  if (loading) return <Loading label={t.loadingAuth} />;
  if (complete) return <Navigate to="/indexing" replace />;

  const valid = form.household_ref && form.no_person !== "" && Number(form.no_person) > 0;

  async function save() {
    if (!valid || !user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.id),
        {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || null,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          imageUrl: user.imageUrl || null,
          household_ref: form.household_ref,
          no_person: Number(form.no_person),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      navigate("/indexing", { replace: true });
    } catch (e) {
      console.error("profile save failed:", e);
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col px-5 py-6">
      <div className="flex justify-end">
        <LangSwitch lang={lang} setLang={setLang} />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <BrandMark size={56} />
            <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-50">{t.updateTitle}</h1>
            <p className="mt-2 max-w-sm text-sm text-slate-400">{t.updateDesc}</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur">
            <ProfileHouseholdFields
              lang={lang}
              value={form}
              onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
            />
            <button
              onClick={save}
              disabled={!valid || saving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition enabled:hover:from-cyan-400 enabled:hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? t.saving : t.continue}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}