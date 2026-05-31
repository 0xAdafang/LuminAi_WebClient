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
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
            <div className="absolute top-8 right-8 z-50">
                <button
                    onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                    className="text-micro font-bold text-text-muted hover:text-text-primary border border-lumin-border px-3 py-1.5 rounded-full uppercase tracking-widest glass"
                >
                    {lang === "fr" ? "EN 🇺🇸" : "FR 🇫🇷"}
                </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[400px] bg-accent-blue/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center max-w-4xl relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue-muted border border-accent-blue/20 text-accent-blue text-caption mb-8"
                >
                    <Sparkles size={14} />
                    <span className="font-medium">{t.landing.tagline}</span>
                </motion.div>

                <h1 className="font-display text-hero-sm md:text-hero text-text-primary mb-6 font-extrabold">
                    Analyze. Index. <br />
                    <span className="text-gradient">Chat.</span>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-text-secondary text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    {t.landing.description}
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={handleStart}
                    className="group relative px-8 py-4 bg-text-primary text-lumin-bg font-bold rounded-full overflow-hidden hover:scale-105 active:scale-95 shadow-elevation-2"
                >
                    <span className="relative z-10 flex items-center gap-2 font-display">
                        {t.landing.button}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </motion.button>
            </motion.div>

            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </div>
    );
}