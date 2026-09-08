import { HOUSEHOLD_REFS } from "../config/data";
import { T } from "../i18n/translations";

/**
 * Controlled household fields shared by /update_profile and /profile.
 * value: { household_ref, no_person }; onChange(partial)
 */
export default function ProfileHouseholdFields({ lang, value, onChange }) {
  const t = T[lang];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-400">
          {t.householdRef} <span className="text-rose-400">*</span>
        </span>
        <select
          value={value.household_ref || ""}
          onChange={(e) => onChange({ household_ref: e.target.value })}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
        >
          <option value="" disabled>{t.selectPlaceholder}</option>
          {HOUSEHOLD_REFS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-400">
          {t.noPerson} <span className="text-rose-400">*</span>
        </span>
        <input
          type="number"
          min="1"
          value={value.no_person ?? ""}
          onChange={(e) => onChange({ no_person: e.target.value })}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
        />
      </label>
    </div>
  );
}