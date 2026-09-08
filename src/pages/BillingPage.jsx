import { useOutletContext } from "react-router-dom";
import { Receipt } from "lucide-react";
import { T } from "../i18n/translations";

// Placeholder — volume & price UI will be built here later.
export default function BillingPage() {
  const { lang } = useOutletContext();
  const t = T[lang];
  return (
    <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-amber-500">
          <Receipt className="text-white" size={26} />
        </div>
        <h1 className="text-xl font-bold text-slate-50">{t.billingTitle}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">{t.billingSoon}</p>
      </div>
    </main>
  );
}
