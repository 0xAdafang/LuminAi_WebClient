"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, Lock, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthModal({ onClose }: { onClose: () => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? "/login" : "/register";
            const { data } = await api.post(endpoint, { email, password });

            if (isLogin) {
                login(data.token);
                router.push("/chat");
                onClose();
            } else {
                setIsLogin(true);
                alert(t.auth.successRegister);
            }
        } catch (err) {
            alert(t.auth.errorAuth);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X size={20} />
                </button>


                <h2 className="text-2xl font-bold text-white mb-2">
                    {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                    {isLogin ? t.auth.loginSubtitle : t.auth.registerSubtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                        <input
                            type="email"
                            placeholder={t.auth.emailPlaceholder}
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-colors"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                        <input
                            type="password"
                            placeholder={t.auth.passwordPlaceholder}
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-colors"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? t.auth.loginButton : t.auth.registerButton)}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 text-blue-400 hover:underline font-medium"
                    >
                        {isLogin ? t.auth.linkRegister : t.auth.linkLogin}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}