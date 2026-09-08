import { T } from "../i18n/translations";

export default function LangSwitch({ lang, setLang }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 p-0.5 text-xs font-medium backdrop-blur">
      {Object.keys(T).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={
            "rounded-full px-3 py-1.5 transition-colors " +
            (lang === l
              ? "bg-slate-100 text-slate-900"
              : "text-slate-400 hover:text-slate-200")
          }
        >
          {T[l].code}
        </button>
      ))}
    </div>
  );
}
