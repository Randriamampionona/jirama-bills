import { HOUSEHOLD_REFS } from "../config/data";
import { T } from "../i18n/translations";

/**
 * Controlled household fields, shared by /update_profile and /profile.
 * existingCounts: { [household_ref]: no_person } for households OTHER users
 * already belong to. When the picked household exists, no_person is inherited
 * and locked so members can't set conflicting counts.
 * householdError: optional inline error shown under the household select
 * (e.g. capacity reached).
 */
export default function ProfileHouseholdFields({
  lang,
  value,
  onChange,
  existingCounts = {},
  householdError = "",
}) {
  const t = T[lang];
  const inherited = value.household_ref ? existingCounts[value.household_ref] : undefined;
  const locked = inherited != null && inherited > 0;

  function handleHousehold(ref) {
    const c = existingCounts[ref];
    if (c != null && c > 0) onChange({ household_ref: ref, no_person: c }); // inherit + lock
    else onChange({ household_ref: ref, no_person: "" }); // new household: clear for entry
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-400">
          {t.householdRef} <span className="text-rose-400">*</span>
        </span>
        <select
          value={value.household_ref || ""}
          onChange={(e) => handleHousehold(e.target.value)}
          className={
            "w-full rounded-xl border bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-500/30 " +
            (householdError ? "border-rose-500/60 focus:border-rose-500" : "border-slate-700 focus:border-cyan-500")
          }
        >
          <option value="" disabled>{t.selectPlaceholder}</option>
          {HOUSEHOLD_REFS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        {householdError && (
          <span className="mt-1.5 block text-[11px] leading-relaxed text-rose-400">
            {householdError}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-400">
          {t.noPerson} <span className="text-rose-400">*</span>
        </span>
        <input
          type="number"
          min="1"
          disabled={locked}
          value={locked ? inherited : (value.no_person ?? "")}
          onChange={(e) => onChange({ no_person: e.target.value })}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {locked && (
          <span className="mt-1 block text-[11px] text-cyan-400/80">{t.inheritedHint}</span>
        )}
      </label>
    </div>
  );
}