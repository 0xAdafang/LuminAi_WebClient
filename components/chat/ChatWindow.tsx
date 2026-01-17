"use client";
import { useState } from "react";
import api from "@/lib/api";
import ChatInput from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ChatWindow({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async (text: string) => {
        const userMsg = { role: "user", content: text };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {

            const { data } = await api.post("/chat", { question: text });


            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.answer,
                sources: data.articles
            }]);

        } catch (err: any) {
            const errorMsg = err.response?.data || "Le serveur de chat ne répond pas.";
            toast.error(`Erreur Chat: ${errorMsg}`);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        const data = new FormData();
        data.append("file", file);

        const uploadPromise = async () => {
            const response = await api.post("/upload", data);
            if (response.status === 201) {
                onUploadSuccess();
                return response;
            }
            throw new Error("Échec de l'indexation");
        };

        toast.promise(uploadPromise(), {
            loading: 'Indexation de votre PDF en cours...',
            success: 'Document indexé et prêt pour l\'analyse ! ✨',
            error: (err) => `Erreur d'upload: ${err.response?.data || 'Vérifiez votre connexion'}`
        });
    };

    const handleIngestUrl = async (url: string) => {
        try {

            await api.post("/ingest", { url });
            toast.success("L'URL a été indexée avec succès !");
        } catch (err: any) {
            toast.error(`Erreur d'indexation : ${err.response?.data || "L'URL est invalide."}`);
        }
    };

    const renderMessageWithCitations = (text: string, sources: any[]) => {
        const parts = text.split(/(\[\^\d+\])/g);

        return parts.map((part, index) => {
            const match = part.match(/\[\^(\d+)\]/);
            if (match) {
                const sourceIndex = parseInt(match[1]) - 1;
                const source = sources[sourceIndex];
                return (
                    <span
                        key={index}
                        title={source?.title}
                        className="inline-flex items-center justify-center w-4 h-4 ml-1 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded cursor-help"
                    >
          {match[1]}
        </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={i}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-slate-800/80 backdrop-blur-md text-slate-100 border border-slate-700 rounded-tl-none'
                            }`}>
                                <p className="text-sm leading-relaxed">{m.content}</p>
                                {m.sources?.length > 0 && (
                                    <div className="mt-3 flex gap-2 overflow-x-auto pt-2 border-t border-slate-700/50">
                                        {m.sources.map((s: any, idx: number) => (
                                            <span key={idx} className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-400 whitespace-nowrap">
                                                📄 {s.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && <div className="text-slate-500 text-xs animate-pulse ml-2">L'IA réfléchit...</div>}
            </div>

            <div className="pb-8">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    onUploadFile={handleFileUpload}
                    onIngestUrl={handleIngestUrl}
                />
            </div>
        </div>
    );
}