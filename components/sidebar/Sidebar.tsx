"use client";
import { useState, useEffect } from "react";
import { FileText, Trash2, ChevronLeft, ChevronRight, Database, Globe, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface DeleteConfirm {
    url: string;
    label: string;
}

export default function Sidebar({ refreshSignal }: { refreshSignal: number }) {
    const { token } = useAuth();
    const { t } = useLanguage();

    const [isOpen, setIsOpen] = useState(true);
    const [documents, setDocuments] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);

    const fetchDocs = async () => {
        try {
            const { data } = await api.get("/documents");
            setDocuments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch documents", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
        const interval = setInterval(fetchDocs, 30000);
        return () => clearInterval(interval);
    }, [refreshSignal]);

    const getDocLabel = (doc: string) => doc.replace("file://", "");

    const handleDeleteClick = (doc: string) => {
        setDeleteConfirm({ url: doc, label: getDocLabel(doc) });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        try {
            await api.delete(`/documents?url=${encodeURIComponent(deleteConfirm.url)}`);
            toast.success(t.sidebar.deleteSuccess);
            fetchDocs();
        } catch (err: any) {
            toast.error(err.response?.data?.error || t.sidebar.deleteError);
        } finally {
            setDeleteConfirm(null);
        }
    };

    return (
        <>
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 320 : 72 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-screen bg-lumin-surface/50 backdrop-blur-xl border-r border-lumin-border flex flex-col overflow-hidden"
            >
                {/* Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-10 bg-accent-blue hover:bg-accent-blue-hover p-1 rounded-full text-white shadow-elevation-1 z-50 transition-colors"
                >
                    {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                <div className="p-5 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-accent-blue-muted rounded-xl text-accent-blue flex-shrink-0">
                            <Database size={22} />
                        </div>
                        {isOpen && (
                            <motion.h2
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-display text-subheading text-text-primary truncate"
                            >
                                {t.sidebar.title}
                            </motion.h2>
                        )}
                    </div>

                    {/* Document list */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
                        {loading ? (
                            <div className="space-y-1.5">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-12 rounded-xl bg-lumin-raised/50 animate-pulse"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    />
                                ))}
                            </div>
                        ) : documents.length === 0 ? (
                            isOpen && (
                                <div className="flex flex-col items-center gap-3 py-12 text-center">
                                    <div className="p-3 bg-lumin-raised rounded-full">
                                        <FileText size={20} className="text-text-faint" />
                                    </div>
                                    <p className="text-text-muted text-caption">{t.sidebar.noDocs}</p>
                                </div>
                            )
                        ) : (
                            <AnimatePresence>
                                {documents.map((doc) => (
                                    <motion.div
                                        key={doc}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        className="group flex items-center justify-between p-3 rounded-xl bg-lumin-raised/30 border border-lumin-border hover:border-lumin-border-hover hover:bg-lumin-raised/60 transition-all"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="text-text-muted group-hover:text-accent-blue flex-shrink-0 transition-colors">
                                                {doc.startsWith("http") ? <Globe size={17} /> : <FileText size={17} />}
                                            </div>
                                            {isOpen && (
                                                <span className="text-body text-text-secondary group-hover:text-text-primary truncate max-w-[160px] transition-colors" title={doc}>
                                                    {getDocLabel(doc)}
                                                </span>
                                            )}
                                        </div>

                                        {isOpen && (
                                            <button
                                                onClick={() => handleDeleteClick(doc)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-accent-red hover:bg-accent-red-muted rounded-lg transition-all flex-shrink-0"
                                                title={t.sidebar.deleteTitle}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Footer */}
                    {isOpen && (
                        <div className="mt-auto space-y-4 pt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-emerald-muted border border-accent-emerald/10 w-fit">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse-subtle" />
                                <span className="text-micro text-accent-emerald font-bold uppercase tracking-widest">
                                    {t.sidebar.status}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-lumin-border flex items-center gap-3 p-2 rounded-xl hover:bg-lumin-raised/40 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-accent-emerald flex-shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-caption font-semibold text-text-primary truncate">{t.sidebar.user}</span>
                                    <span className="text-micro text-text-faint font-mono truncate">
                                        ID: {token?.substring(0, 8)}...
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* Delete modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-sm glass-raised p-6 rounded-2xl shadow-elevation-3"
                        >
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-accent-red-muted rounded-xl">
                                    <AlertTriangle size={20} className="text-accent-red" />
                                </div>
                                <h3 className="font-display text-subheading text-text-primary">{t.sidebar.deleteConfirmTitle}</h3>
                            </div>

                            <p className="text-body text-text-secondary mb-2">{t.sidebar.deleteConfirmMessage}</p>
                            <p className="text-body text-text-primary font-mono bg-lumin-surface px-3 py-2 rounded-lg truncate mb-6 border border-lumin-border">
                                {deleteConfirm.label}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2.5 text-body font-medium text-text-secondary bg-lumin-raised hover:bg-lumin-border rounded-xl transition-colors"
                                >
                                    {t.sidebar.deleteCancel}
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-2.5 text-body font-medium text-white bg-accent-red hover:brightness-110 rounded-xl transition-all"
                                >
                                    {t.sidebar.deleteButton}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}