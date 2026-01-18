"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


    const { t, lang, setLang } = useLanguage();

    const handleStart = () => {
        if (token) {
            router.push("/chat");
        } else {
            setIsAuthModalOpen(true);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
            {/* Bouton de langue */}
            <div className="absolute top-8 right-8 z-50">
                <button
                    onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                    className="text-[10px] font-bold text-slate-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-all uppercase tracking-widest bg-slate-900/50 backdrop-blur-md"
                >
                    {lang === "fr" ? "EN 🇺🇸" : "FR 🇫🇷"}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl"
            >
                {/* Tagline dynamique */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
                    <Sparkles size={14} />
                    <span>{t.landing.tagline}</span>
                </div>


                <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
                    Analyze. Index. <br />
                    <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Chat.
                    </span>
                </h1>

                {/* Description dynamique */}
                <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    {t.landing.description}
                </p>

                {/* Bouton dynamique */}
                <button
                    onClick={handleStart}
                    className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {t.landing.button}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </motion.div>

            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </div>
    );
}