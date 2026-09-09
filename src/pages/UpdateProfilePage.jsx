import { useMemo, useState } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { T } from "../i18n/translations";
import { useProfileContext } from "../context/ProfileContext";
import { useUsers } from "../hooks/useUsers";
import BrandMark from "../components/BrandMark";
import LangSwitch from "../components/LangSwitch";
import ProfileHouseholdFields from "../components/ProfileForm";

/**
 * Onboarding. Completeness comes from AuthGate (Clerk session). Saving writes to
 * BOTH Clerk metadata (instant routing) and Firestore (billing source of truth).
 * A household is capped at its no_person: once that many accounts are registered
 * under a household_ref, no new member may join it.
 */
export default function UpdateProfilePage() {
  const { lang, setLang } = useOutletContext();
  const t = T[lang];
  const { user } = useUser();
  const { complete, fbReady } = useProfileContext();
  const navigate = useNavigate();
  const { users } = useUsers(fbReady);

  const [form, setForm] = useState({ household_ref: "", no_person: "" });
  const [saving, setSaving] = useState(false);

  // Per household_ref (self excluded): the shared no_person, and how many
  // accounts are already registered under it.
  const { existingCounts, memberCounts } = useMemo(() => {
    const existingCounts = {};
    const memberCounts = {};
    for (const u of users) {
      if (u.id === user?.id || !u.household_ref) continue;
      existingCounts[u.household_ref] = Math.max(existingCounts[u.household_ref] || 0, Number(u.no_person) || 0);
      memberCounts[u.household_ref] = (memberCounts[u.household_ref] || 0) + 1;
    }
    return { existingCounts, memberCounts };
  }, [users, user?.id]);

  if (complete) return <Navigate to="/indexing" replace />;

  const ref = form.household_ref;
  const cap = ref ? existingCounts[ref] : undefined;       // household's no_person
  const registered = ref ? memberCounts[ref] || 0 : 0;     // accounts already in it
  const capacityFull = cap != null && cap > 0 && registered >= cap;
  const capacityError = capacityFull ? t.capacityFull.replace("{max}", String(cap)) : "";

  const valid =
    form.household_ref &&
    form.no_person !== "" &&
    Number(form.no_person) > 0 &&
    !capacityFull;

  async function save() {
    if (!valid || !user) return;
    setSaving(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          household_ref: form.household_ref,
          no_person: Number(form.no_person),
        },
      });
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
              existingCounts={existingCounts}
              householdError={capacityError}
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