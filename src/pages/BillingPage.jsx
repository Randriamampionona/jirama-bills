import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Droplet, Zap, Pencil, Check, X, Users, Home } from "lucide-react";
import { T, labelMonth } from "../i18n/translations";
import { THEME, BILLS, formatAr } from "../config/data";
import { firebaseReady } from "../config/firebase";
import { periodParts } from "../lib/bills";
import { useBills } from "../hooks/useBills";
import { useUsers } from "../hooks/useUsers";

export default function BillingPage() {
  const { lang } = useOutletContext();
  const t = T[lang];
  const { user } = useUser();
  const { months, billsByMonth, updateAmount } = useBills();
  const { users } = useUsers();

  const [tab, setTab] = useState("water");
  const currentDate = periodParts().date;
  const [month, setMonth] = useState(currentDate);
  const monthOptions = months.length ? months : [currentDate];

  const waterBill = billsByMonth(month).find((b) => b.type === "water") || null;
  const ym = waterBill?.ym;
  const amount = waterBill?.amount ?? null;

  // amount inline edit
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const startEdit = () => { setDraft(amount != null ? String(amount) : ""); setEditing(true); };
  async function saveAmount() {
    const clean = draft.replace(/[^\d.]/g, "");
    if (ym) await updateAmount("water", ym, clean === "" ? null : Number(clean));
    setEditing(false);
  }

  // split state
  const [mode, setMode] = useState("person");
  const [excluded, setExcluded] = useState(() => new Set());
  const toggleExclude = (id) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const activeUsers = users.filter((u) => !excluded.has(u.id));
  const totalPersons = activeUsers.reduce((s, u) => s + (Number(u.no_person) || 0), 0);
  const totalHouseholds = activeUsers.length;

  const shareFor = (u) => {
    if (excluded.has(u.id) || amount == null) return null;
    if (mode === "person") return totalPersons ? (Number(u.no_person || 0) * amount) / totalPersons : 0;
    return totalHouseholds ? amount / totalHouseholds : 0;
  };

  const theme = THEME.water;

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
      {/* header: heading + month + description */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-50">{t.billingTitle}</h1>
          <p className="mt-1 max-w-md text-sm text-slate-400">{t.billingDesc}</p>
        </div>
        <label className="block sm:w-48">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.selectMonth}</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>{labelMonth(m, lang)}</option>
            ))}
          </select>
        </label>
      </div>

      {/* tabs */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
        {Object.values(BILLS).map((b) => {
          const active = tab === b.key;
          const th = THEME[b.key];
          const TabIcon = th.icon;
          const label = b.key === "water" ? t.water : t.electricity;
          return (
            <button
              key={b.key}
              onClick={() => setTab(b.key)}
              className={
                "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition " +
                (active ? "bg-slate-100 text-slate-900 shadow" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200")
              }
            >
              <TabIcon size={17} className={active ? "" : th.text} />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      {tab === "electricity" ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
            <Zap className="text-white" size={26} />
          </div>
          <h2 className="text-lg font-bold text-slate-50">{t.comingSoon}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">{t.comingSoonDesc}</p>
        </div>
      ) : (
        <>
          {/* amount card + inline edit */}
          <div className={"relative overflow-hidden rounded-3xl border bg-slate-900/70 p-5 shadow-2xl sm:p-6 " + theme.border}>
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
              style={{ background: theme.glow }}
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={"flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg " + theme.grad}>
                  <Droplet className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.amountLabel}</p>
                  <p className="text-sm text-slate-400">{labelMonth(month, lang)}</p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  <Pencil size={15} /> {amount == null ? t.setAmount : ""}
                </button>
              )}
            </div>

            <div className="relative mt-4">
              {editing ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    autoFocus
                    inputMode="numeric"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveAmount()}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-2xl font-bold text-slate-50 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 sm:max-w-xs"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveAmount} className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
                      <Check size={16} /> {t.save}
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">
                      <X size={16} /> {t.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-3xl font-bold tracking-tight text-slate-50">
                  {amount == null ? <span className="text-lg font-medium text-slate-500">{t.noAmount}</span> : formatAr(amount, 0)}
                </p>
              )}
            </div>
          </div>

          {/* split mode toggle */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-300">{t.splitMode}</span>
            <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900/60 p-1">
              <button
                onClick={() => setMode("person")}
                className={"flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition " + (mode === "person" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-200")}
              >
                <Users size={14} /> {t.byPerson}
              </button>
              <button
                onClick={() => setMode("household")}
                className={"flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition " + (mode === "household" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-200")}
              >
                <Home size={14} /> {t.byHousehold}
              </button>
            </div>
          </div>

          {/* denominator summary */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-500">{t.activePersons}</p>
              <p className="text-lg font-bold text-slate-100">{totalPersons}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-500">{t.activeHouseholds}</p>
              <p className="text-lg font-bold text-slate-100">{totalHouseholds}</p>
            </div>
          </div>

          {/* households list */}
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800">
            <div className="border-b border-slate-800 bg-slate-950/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.households}
            </div>
            <ul className="divide-y divide-slate-800">
              {users.map((u) => {
                const isMe = u.id === user?.id;
                const isExcluded = excluded.has(u.id);
                const share = shareFor(u);
                const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || u.id;
                return (
                  <li
                    key={u.id}
                    className={
                      "flex items-center justify-between gap-3 px-4 py-3 " +
                      (isMe ? "bg-cyan-500/5 ring-1 ring-inset ring-cyan-500/30" : "bg-slate-950/30")
                    }
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={"truncate text-sm font-medium " + (isExcluded ? "text-slate-500 line-through" : "text-slate-100")}>
                          {name}
                        </span>
                        {isMe && (
                          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                            {t.you}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {u.household_ref || "—"} · {Number(u.no_person) || 0} {t.persons}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={"text-sm font-bold " + (isExcluded ? "text-slate-600" : "text-emerald-300")}>
                        {isExcluded ? t.excluded : share == null ? "—" : formatAr(share, 2)}
                      </span>
                      <button
                        onClick={() => toggleExclude(u.id)}
                        className={
                          "rounded-lg border px-2.5 py-1 text-xs font-semibold transition " +
                          (isExcluded
                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "border-rose-500/40 text-rose-300 hover:bg-rose-500/10")
                        }
                      >
                        {isExcluded ? t.excluded : t.exclude}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}