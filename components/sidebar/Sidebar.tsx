"use client";
import { useState, useEffect } from "react";
import { FileText, Trash2, ChevronLeft, ChevronRight, Database, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Sidebar({ refreshSignal }: { refreshSignal: number }) {
    const [isOpen, setIsOpen] = useState(true);
    const [documents, setDocuments] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchDocs = async () => {
        try {
            const { data } = await api.get("/documents");
            setDocuments(data || []);
        } catch (err) {
            console.error("Erreur lors de la récupération des docs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();

        const interval = setInterval(fetchDocs, 30000);
        return () => clearInterval(interval);
    }, [refreshSignal]);

    const handleDelete = async (url: string) => {
        if (!confirm("Supprimer ce document de votre base de connaissances ?")) return;

        try {

            await api.delete(`/documents?url=${encodeURIComponent(url)}`);
            toast.success("Document supprimé");
            fetchDocs(); // Rafraîchir la liste
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 320 : 80 }}
            className="relative h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col transition-all duration-300"
        >
            {/* Bouton de toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-10 bg-blue-600 p-1 rounded-full text-white shadow-lg z-50"
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className="p-6 flex flex-col h-full">
                {/* Header de la Sidebar */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Database size={24} />
                    </div>
                    {isOpen && (
                        <motion.h2
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-xl font-bold text-white tracking-tight"
                        >
                            Ma Base
                        </motion.h2>
                    )}
                </div>

                {/* Liste des documents */}
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-slate-500 text-sm animate-pulse">Chargement...</div>
                    ) : documents.length === 0 ? (
                        isOpen && <p className="text-slate-500 text-xs italic">Aucun document indexé</p>
                    ) : (
                        documents.map((doc, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="text-slate-400 group-hover:text-blue-400">
                                        {doc.startsWith("http") ? <Globe size={18} /> : <FileText size={18} />}
                                    </div>
                                    {isOpen && (
                                        <span className="text-sm text-slate-300 truncate max-w-[160px]">
                      {doc.replace("file://", "")}
                    </span>
                                    )}
                                </div>

                                {isOpen && (
                                    <button
                                        onClick={() => handleDelete(doc)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer (Info Utilisateur / Logout) */}
                {isOpen && (
                    <div className="mt-auto pt-6 border-t border-slate-800">
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400" />
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white">Utilisateur Pro</span>
                                <span className="text-[10px] text-slate-500">Plan Enterprise</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}