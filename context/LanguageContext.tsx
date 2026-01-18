"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";

type Language = "en" | "fr";

interface LanguageContextType {
    lang : Language;
    setLang: (lang: Language) => void;
    t: typeof translations.fr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>("fr");

    useEffect(() => {
        const saved = localStorage.getItem("lang") as Language;
        if (saved) setLang(saved);
    }, []);

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem("lang", newLang);
    }

    return (
        <LanguageContext.Provider value={{lang, setLang: handleSetLang, t: translations[lang]}}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}