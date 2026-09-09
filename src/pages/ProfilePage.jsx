import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Check, Lock } from "lucide-react";
import { db } from "../config/firebase";
import { T } from "../i18n/translations";
import { useProfileContext } from "../context/ProfileContext";

/**
 * Full profile editor.
 * - firstName / lastName -> Clerk (mirrored to Firestore)
 * - email + avatar       -> managed by Clerk, read-only
 * - household_ref        -> READ-ONLY (assigned at sign-up; not editable here)
 * - no_person            -> editable (update the household head count)
 * Completeness is mirrored into Clerk metadata so routing stays instant.
 */
export default function ProfilePage() {
  const { lang } = useOutletContext();
  const t = T[lang];
  const { user } = useUser();
  const { profile } = useProfileContext();

  const [form, setForm] = useState({ firstName: "", lastName: "", household_ref: "", no_person: "" });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      household_ref: profile?.household_ref || "",
      no_person: profile?.no_person ?? "",
    });
  }, [user, profile]);

  const email = user?.primaryEmailAddress?.emailAddress || "";
  const valid = form.household_ref && form.no_person !== "" && Number(form.no_person) > 0;

  async function save() {
    if (!valid || !user) return;
    setSaving(true);
    try {
      await user.update({
        firstName: form.firstName,
        lastName: form.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          household_ref: form.household_ref, // preserved unchanged (read-only)
          no_person: Number(form.no_person),
        },
      });
      await setDoc(
        doc(db, "users", user.id),
        {
          firstName: form.firstName || null,
          lastName: form.lastName || null,
          household_ref: form.household_ref, // preserved unchanged (read-only)
          no_person: Number(form.no_person),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSavedAt(Date.now());
    } catch (e) {
      console.error("profile save failed:", e);
    } finally {
      setSaving(false);
    }
  }

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-50">{t.profileTitle}</h1>
        <p className="mt-1 text-sm text-slate-400">{t.profileDesc}</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-6 flex items-center gap-4">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-slate-800" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">{email}</p>
            {profile?.household_ref && <p className="text-xs text-slate-500">{profile.household_ref}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-400">{t.firstName}</span>
            <input
              value={form.firstName}
              onChange={(e) => set({ firstName: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-400">{t.lastName}</span>
            <input
              value={form.lastName}
              onChange={(e) => set({ lastName: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-slate-400">{t.emailLabel}</span>
            <input
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-500"
            />
          </label>
        </div>

        {/* household reference (read-only) + head count (editable) */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="block">
            <span className="mb-1 block text-xs font-medium text-slate-400">{t.householdRef}</span>
            {/* Read-only value — styled as info, not a form control, but kept legible */}
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5">
              <span className="truncate text-sm font-semibold text-slate-100">
                {form.household_ref || "—"}
              </span>
              <Lock size={14} className="shrink-0 text-slate-500" />
            </div>
            <span className="mt-1 block text-[11px] text-slate-500">{t.householdLocked}</span>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-400">
              {t.noPerson} <span className="text-rose-400">*</span>
            </span>
            <input
              type="number"
              min="1"
              value={form.no_person ?? ""}
              onChange={(e) => set({ no_person: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={save}
            disabled={!valid || saving}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition enabled:hover:from-cyan-400 enabled:hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? t.saving : t.save}
          </button>
          {savedAt > 0 && !saving && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Check size={14} /> {t.saved}
            </span>
          )}
        </div>
      </div>
    </main>
  );
}