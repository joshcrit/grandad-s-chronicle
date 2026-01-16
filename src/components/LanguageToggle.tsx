import { useEffect, useState } from "react";

const STORAGE_KEY = "site-language";
const DEFAULT_LANG = "en";

export function LanguageToggle() {
  const [lang, setLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = saved === "es" || saved === "en" ? saved : DEFAULT_LANG;
    setLang(initial);
    document.documentElement.lang = initial;
  }, []);

  const updateLang = (next: "en" | "es") => {
    setLang(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-toggle__btn ${lang === "en" ? "is-active" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => updateLang("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-toggle__btn ${lang === "es" ? "is-active" : ""}`}
        aria-pressed={lang === "es"}
        onClick={() => updateLang("es")}
      >
        ES
      </button>
    </div>
  );
}
