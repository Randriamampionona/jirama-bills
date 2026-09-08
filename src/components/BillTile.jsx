import { Phone, Check, X, FileText } from "lucide-react";
import { T, labelMonth } from "../i18n/translations";
import { THEME, INDEX_CALL_NUMBER } from "../config/data";

/**
 * bill: the current-month Firestore record for this utility (or null while loading).
 * done is derived from bill.status; doneBy from bill.done_by.
 * Status is one-way: only actionable while not_done.
 */
export default function BillTile({ lang, tabKey, bill, onMarkDone }) {
  const t = T[lang];
  const theme = THEME[tabKey];
  const Icon = theme.icon;
  const done = bill?.status === "done";
  const doneBy = bill?.done_by;
  const periodLabel = labelMonth(bill?.date, lang) || labelMonth(nowMMYYYY(), lang);
  const desc = tabKey === "water" ? t.descWater : t.descElec;
  const refValue = bill?.ref || "—";

  return (
    <div className={"relative overflow-hidden rounded-3xl border bg-slate-900/70 shadow-2xl backdrop-blur " + theme.border}>
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
        style={{ background: theme.glow }}
      />

      {/* header */}
      <div className="relative flex items-start justify-between gap-4 border-b border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className={"flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg " + theme.grad}>
            <Icon className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-50">{t.brand}</h2>
            <p className={"text-sm font-medium " + theme.text}>
              {tabKey === "water" ? t.water : t.electricity}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{t.period}</p>
          <p className="text-sm font-semibold text-slate-200">{periodLabel}</p>
        </div>
      </div>

      {/* body */}
      <div className="relative space-y-5 p-5 sm:p-6">
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.description}
          </p>
          <p className="text-sm leading-relaxed text-slate-300">{desc}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <FileText size={13} /> {t.ref}
            </div>
            <p className="font-mono text-base font-semibold tracking-wide text-slate-100">
              {refValue}
            </p>
          </div>

          {/* status: clickable only while not_done (one-way) */}
          <button
            onClick={() => !done && onMarkDone()}
            disabled={done}
            className={
              "group flex flex-col items-start rounded-2xl border p-4 text-left transition " +
              (done
                ? "cursor-default border-emerald-500/40 bg-emerald-500/10"
                : "border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/15")
            }
          >
            <div className="mb-1 text-xs font-medium text-slate-400">{t.status}</div>
            <div className="flex items-center gap-2">
              <span className={"flex h-6 w-6 items-center justify-center rounded-full " + (done ? "bg-emerald-500" : "bg-rose-500")}>
                {done ? <Check size={15} className="text-white" /> : <X size={15} className="text-white" />}
              </span>
              <span className={"text-base font-semibold " + (done ? "text-emerald-300" : "text-rose-300")}>
                {done ? t.done : t.pending}
              </span>
            </div>
            {done ? (
              doneBy && (
                <span className="mt-1 text-[11px] text-emerald-400/80">
                  {t.by} {doneBy}
                </span>
              )
            ) : (
              /* always visible now (no longer hover-only) */
              <span className="mt-1 text-[11px] text-slate-400">{t.tapHint}</span>
            )}
          </button>
        </div>

        {/* CTA — dials 547 on a real device */}
        <a
          href={`tel:${INDEX_CALL_NUMBER}`}
          className={"flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-semibold text-white shadow-lg transition " + theme.btn}
        >
          <Phone size={19} />
          <span>{t.cta}</span>
          <span className="rounded-md bg-black/20 px-2 py-0.5 text-sm font-bold tracking-widest">
            {INDEX_CALL_NUMBER}
          </span>
        </a>
      </div>
    </div>
  );
}

function nowMMYYYY() {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
