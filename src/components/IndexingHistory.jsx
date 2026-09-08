import { useState, useEffect } from "react";
import { Check, X, History, Droplet, Zap } from "lucide-react";
import { T, labelMonth } from "../i18n/translations";

const ICON = { water: Droplet, electricity: Zap };

// months: array of "MM/YYYY" (newest first). rowsFor(date) -> bill records.
export default function IndexingHistory({ lang, months, rowsFor }) {
  const t = T[lang];
  const [selected, setSelected] = useState(months[0] || "");

  useEffect(() => {
    if (!selected && months[0]) setSelected(months[0]);
  }, [months, selected]);

  const rows = selected ? rowsFor(selected) : [];

  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <History size={18} className="text-slate-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-100">{t.history}</h3>
          <p className="text-xs text-slate-500">{t.historyDesc}</p>
        </div>
      </div>

      {months.length === 0 ? (
        <p className="text-sm text-slate-500">{t.noHistory}</p>
      ) : (
        <>
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-medium text-slate-500">{t.selectMonth}</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
            >
              {months.map((m) => (
                <option key={m} value={m}>{labelMonth(m, lang)}</option>
              ))}
            </select>
          </label>

          <ul className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800">
            {rows.map((b) => {
              const RowIcon = ICON[b.type] || Droplet;
              const done = b.status === "done";
              const label = b.type === "water" ? t.water : t.electricity;
              return (
                <li key={b.id} className="flex items-center justify-between gap-3 bg-slate-950/40 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <RowIcon size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-200">{label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    {done && b.done_by && (
                      <span className="hidden max-w-[160px] truncate text-xs text-slate-500 sm:inline">
                        {t.by} {b.done_by}
                      </span>
                    )}
                    <span
                      className={
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold " +
                        (done ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300")
                      }
                    >
                      {done ? <Check size={12} /> : <X size={12} />}
                      {done ? t.done : t.pending}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
