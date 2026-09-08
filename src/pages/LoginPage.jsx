import { SignIn, useAuth } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Navigate } from "react-router-dom";
import { T } from "../i18n/translations";
import LangSwitch from "../components/LangSwitch";
import BrandMark from "../components/BrandMark";

export default function LoginPage({ lang, setLang }) {
  const t = T[lang];
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) return <Navigate to="/indexing" replace />;

  return (
    <div className="flex min-h-screen flex-col px-5 py-6">
      <div className="flex justify-end">
        <LangSwitch lang={lang} setLang={setLang} />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <BrandMark size={64} />
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-50">{t.appTitle}</h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">{t.loginSub}</p>
          </div>
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            forceRedirectUrl="/indexing"
            appearance={{
              baseTheme: dark,
              variables: { colorPrimary: "#06b6d4" },
              elements: { rootBox: "mx-auto", card: "bg-slate-900/70 border border-slate-800" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
