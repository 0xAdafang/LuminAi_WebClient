"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

export default function AuthModal({ onClose }: { onClose: () => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const validate = (): string | null => {
        if (!email.trim() || !password) return t.auth.errorEmpty;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t.auth.errorEmailFormat;
        if (!isLogin && password.length < 8) return t.auth.errorPasswordLength;
        return null;
    };

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const { data } = await api.post("/login", { email, password });
                login(data.token);
                router.push("/chat");
                onClose();
            } else {
                await api.post("/register", { email, password });
                toast.success(t.auth.successRegister);
                setIsLogin(true);
                setPassword("");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || t.auth.errorAuth);
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md glass-raised p-8 rounded-3xl shadow-elevation-3"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="font-display text-heading text-text-primary mb-2">
                    {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
                </h2>
                <p className="text-text-secondary text-body mb-8">
                    {isLogin ? t.auth.loginSubtitle : t.auth.registerSubtitle}
                </p>

                <div className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-text-muted" size={18} />
                        <input
                            type="email"
                            placeholder={t.auth.emailPlaceholder}
                            required
                            className="w-full bg-lumin-surface border border-lumin-border rounded-xl py-2.5 pl-10 pr-4 text-text-primary placeholder-text-muted outline-none focus:border-accent-blue transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-text-muted" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t.auth.passwordPlaceholder}
                            required
                            className="w-full bg-lumin-surface border border-lumin-border rounded-xl py-2.5 pl-10 pr-12 text-text-primary placeholder-text-muted outline-none focus:border-accent-blue transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-text-muted hover:text-text-secondary transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <p className="text-caption text-text-muted">{t.auth.passwordHint}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white font-display font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-glow-blue"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : isLogin ? (
                            t.auth.loginButton
                        ) : (
                            t.auth.registerButton
                        )}
                    </button>
                </div>

                <p className="mt-6 text-center text-body text-text-muted">
                    {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setPassword("");
                        }}
                        className="ml-1 text-accent-blue hover:text-accent-blue-hover hover:underline font-medium"
                    >
                        {isLogin ? t.auth.linkRegister : t.auth.linkLogin}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}