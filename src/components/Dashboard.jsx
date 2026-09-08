import { useState } from "react";
import { MapPin, User, Mail, LogOut } from "lucide-react";
import { T } from "../i18n/translations";
import { BILLS, THEME } from "../config/data";
import { useBillStatus } from "../hooks/useBillStatus";
import LangSwitch from "./LangSwitch";
import BrandMark from "./BrandMark";
import BillTile from "./BillTile";

export default function Dashboard({ lang, setLang, email, onLogout }) {
  const t = T[lang];
  const [tab, setTab] = useState("water");
  const { statusMap, toggle } = useBillStatus();
  const bill = BILLS[tab];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark size={38} />
            <span className="text-sm font-bold tracking-tight text-slate-100 sm:text-base">
              {t.brand}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LangSwitch lang={lang} setLang={setLang} />
            <button
              onClick={onLogout}
              aria-label={t.logout}
              title={t.logout}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-8">
        {/* tabs */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
          {Object.values(BILLS).map((b) => {
            const active = tab === b.key;
            const th = THEME[b.key];
            const TabIcon = th.icon;
            const label = b.key === "water" ? t.water : t.electricity;
            const bDone = statusMap[b.key];
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
                  className={"ml-0.5 h-2 w-2 shrink-0 rounded-full " + (bDone ? "bg-emerald-500" : "bg-rose-500")}
                />
              </button>
            );
          })}
        </div>

        <BillTile lang={lang} bill={bill} done={statusMap[tab]} onToggle={() => toggle(tab)} />

        {/* footer / account */}
        <footer className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                <User size={17} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.account}</p>
                <p className="text-sm font-semibold text-slate-100">{t.accountName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                <MapPin size={17} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.address}</p>
                <p className="text-sm leading-relaxed text-slate-300">{t.addressLine}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
            <Mail size={13} />
            <span>{t.signedInAs}</span>
            <span className="truncate font-medium text-slate-400">{email}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
