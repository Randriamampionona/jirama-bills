import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { T } from "../i18n/translations";
import { BILLS, THEME } from "../config/data";
import { firebaseReady } from "../config/firebase";
import { useBills } from "../hooks/useBills";
import BillTile from "../components/BillTile";
import IndexingHistory from "../components/IndexingHistory";
import ConfirmDialog from "../components/ConfirmDialog";

export default function IndexingPage() {
  const { lang } = useOutletContext();
  const t = T[lang];
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const [tab, setTab] = useState("water");
  const [confirmFor, setConfirmFor] = useState(null); // "water" | "electricity" | null
  const { current, months, billsByMonth, markDone } = useBills();

  if (!firebaseReady) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-amber-200">
          {t.configNeeded}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      {/* tabs */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
        {Object.values(BILLS).map((b) => {
          const active = tab === b.key;
          const th = THEME[b.key];
          const TabIcon = th.icon;
          const label = b.key === "water" ? t.water : t.electricity;
          const done = current[b.key]?.status === "done";
          return (
            <button
              key={b.key}
              onClick={() => setTab(b.key)}
              className={
                "relative flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition " +
                (active
                  ? "bg-slate-100 text-slate-900 shadow"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200")
              }
            >
              <TabIcon size={17} className={active ? "" : th.text} />
              <span className="truncate">{label}</span>
              <span
                aria-hidden
                className={
                  "ml-0.5 h-2 w-2 shrink-0 rounded-full " +
                  (done ? "bg-emerald-500" : "bg-rose-500")
                }
              />
            </button>
          );
        })}
      </div>

      <BillTile
        lang={lang}
        tabKey={tab}
        bill={current[tab]}
        onMarkDone={() => setConfirmFor(tab)}
      />

      <IndexingHistory lang={lang} months={months} rowsFor={billsByMonth} />

      {/* account footer */}
      <footer className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.account}
            </p>
            <p className="text-sm font-semibold text-slate-100">
              {t.accountName}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.address}
            </p>
            <p className="text-sm leading-relaxed text-slate-300">
              {t.addressLine}
            </p>
          </div>
        </div>
      </footer>

      <ConfirmDialog
        open={confirmFor !== null}
        title={t.confirmTitle}
        description={t.confirmDesc}
        confirmLabel={t.confirmYes}
        cancelLabel={t.confirmNo}
        onCancel={() => setConfirmFor(null)}
        onConfirm={() => {
          markDone(confirmFor, email);
          setConfirmFor(null);
        }}
      />
    </main>
  );
}
