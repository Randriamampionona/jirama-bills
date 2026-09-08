import { useState } from "react";
import { Mail, Bell } from "lucide-react";
import { T } from "../i18n/translations";
import LangSwitch from "./LangSwitch";
import BrandMark from "./BrandMark";

// UI-only login. Replace with Clerk's <SignIn /> later (see README).
export default function Login({ lang, setLang, onSubmit }) {
  const t = T[lang];
  const [email, setEmail] = useState("");
  const valid = /^\S+@\S+\.\S+$/.test(email);

  return (
    <div className="flex min-h-screen flex-col px-5 py-6">
      <div className="flex justify-end">
        <LangSwitch lang={lang} setLang={setLang} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <BrandMark size={64} />
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-50">
              {t.loginTitle}
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
              {t.loginSub}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
              {t.emailLabel}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                id="email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && valid && onSubmit(email)}
                placeholder={t.emailPh}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <button
              onClick={() => valid && onSubmit(email)}
              disabled={!valid}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition enabled:hover:from-cyan-400 enabled:hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Bell size={18} />
              {t.notify}
            </button>

            <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
              {t.loginNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
