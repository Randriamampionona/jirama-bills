import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Menu, X, LogOut, FileText, Receipt, User, Mail } from "lucide-react";
import { T } from "../i18n/translations";
import BrandMark from "./BrandMark";
import LangSwitch from "./LangSwitch";

function navClass({ isActive }) {
  return (
    "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition " +
    (isActive
      ? "bg-slate-100 text-slate-900"
      : "text-slate-300 hover:bg-slate-800 hover:text-white")
  );
}

export default function Navbar({ lang, setLang }) {
  const t = T[lang];
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const email = user?.primaryEmailAddress?.emailAddress || "";

  const links = (
    <>
      <NavLink to="/indexing" className={navClass} onClick={() => setOpen(false)}>
        <FileText size={16} /> {t.navIndex}
      </NavLink>
      <NavLink to="/billing" className={navClass} onClick={() => setOpen(false)}>
        <Receipt size={16} /> {t.navBilling}
      </NavLink>
      <NavLink to="/profile" className={navClass} onClick={() => setOpen(false)}>
        <User size={16} /> {t.navProfile}
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <BrandMark size={36} />
          <span className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-100 sm:text-base">
            {t.brand}
          </span>
        </div>

        {/* desktop */}
        <nav className="ml-auto hidden items-center gap-2 md:flex">
          {links}
          <div className="mx-1 h-6 w-px bg-slate-800" />
          <LangSwitch lang={lang} setLang={setLang} />
          <span className="hidden max-w-[200px] truncate text-xs text-slate-400 lg:inline" title={email}>
            {email}
          </span>
          <button
            onClick={() => signOut()}
            title={t.logout}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          >
            <LogOut size={17} />
          </button>
        </nav>

        {/* mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={t.menu}
          aria-expanded={open}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-200 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            <Mail size={13} />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex flex-col gap-1.5">{links}</div>
          <div className="mt-4 flex items-center justify-between">
            <LangSwitch lang={lang} setLang={setLang} />
            <button
              onClick={() => { setOpen(false); signOut(); }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              <LogOut size={16} /> {t.logout}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}