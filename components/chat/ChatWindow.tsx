"use client";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import ChatInput from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
}

interface Source {
    id: number;
    title: string;
    content: string;
    summary: string;
    url: string;
}

export default function ChatWindow({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const { t } = useLanguage();

    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSendMessage = async (text: string) => {
        const userMsg: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const { data } = await api.post("/chat", { question: text });
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.answer, sources: data.articles },
            ]);
        } catch (err: any) {
            toast.error(err.response?.data?.error || t.chat.errorDefault);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const uploadPromise = async () => {
            const response = await api.post("/upload", formData);
            if (response.status === 201) {
                onUploadSuccess();
                return response;
            }
            throw new Error(t.chat.errorUpload);
        };

        toast.promise(uploadPromise(), {
            loading: t.chat.uploadLoading,
            success: (res) => (res.data.failed > 0 ? res.data.message : t.chat.uploadSuccess),
            error: (err) => err.response?.data?.error || t.chat.errorUpload,
        });
    };

    const handleIngestUrl = async (url: string) => {
        try {
            await api.post("/ingest", { url });
            toast.success(t.chat.ingestSuccess);
            onUploadSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.error || t.chat.errorIngest);
        }
    };

    const renderCitations = (text: string, sources?: Source[]) => {
        const parts = text.split(/(\[\^\d+\])/g);
        return parts.map((part, index) => {
            const match = part.match(/\[\^(\d+)\]/);
            if (match) {
                const sourceIndex = parseInt(match[1]) - 1;
                const source = sources?.[sourceIndex];
                return (
                    <span
                        key={index}
                        title={source?.title || "Source"}
                        className="inline-flex items-center justify-center w-4 h-4 ml-0.5 text-[9px] font-bold bg-accent-blue-muted text-accent-blue border border-accent-blue/30 rounded cursor-help align-super"
                    >
                        {match[1]}
                    </span>
                );
            }
            return part;
        });
    };

    const WithCitations = ({ children, sources }: { children: React.ReactNode; sources?: Source[] }) => {
        if (typeof children === "string") return <>{renderCitations(children, sources)}</>;
        if (Array.isArray(children)) {
            return (
                <>
                    {children.map((child, i) =>
                        typeof child === "string" ? (
                            <span key={i}>{renderCitations(child, sources)}</span>
                        ) : (
                            child
                        )
                    )}
                </>
            );
        }
        return <>{children}</>;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 custom-scrollbar">
                {/* Empty state */}
                {messages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-accent-blue-muted flex items-center justify-center">
                            <span className="text-2xl">✦</span>
                        </div>
                        <div>
                            <h3 className="font-display text-subheading text-text-primary mb-1">{t.chat.emptyTitle}</h3>
                            <p className="text-body text-text-muted max-w-md">{t.chat.emptyDescription}</p>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-elevation-1 ${
                                    m.role === "user"
                                        ? "bg-accent-blue text-white rounded-tr-sm"
                                        : "glass text-text-primary rounded-tl-sm"
                                }`}
                            >
                                <div className="text-body leading-relaxed prose prose-invert prose-chat max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ children }) => (
                                                <p className="mb-2 last:mb-0">
                                                    <WithCitations sources={m.sources}>{children}</WithCitations>
                                                </p>
                                            ),
                                            li: ({ children }) => (
                                                <li>
                                                    <WithCitations sources={m.sources}>{children}</WithCitations>
                                                </li>
                                            ),
                                            td: ({ children }) => (
                                                <td className="p-2 border-b border-lumin-border">
                                                    <WithCitations sources={m.sources}>{children}</WithCitations>
                                                </td>
                                            ),
                                            table: ({ children }) => (
                                                <div className="overflow-x-auto my-3 rounded-xl border border-lumin-border">
                                                    <table className="min-w-full text-caption text-left">{children}</table>
                                                </div>
                                            ),
                                            th: ({ children }) => (
                                                <th className="bg-lumin-surface p-2 border-b border-lumin-border font-semibold text-text-secondary">
                                                    {children}
                                                </th>
                                            ),
                                            ul: ({ children }) => <ul className="list-disc ml-4 space-y-1 my-2">{children}</ul>,
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>

                                {m.sources && m.sources.length > 0 && (
                                    <div className="mt-3 flex gap-2 overflow-x-auto pt-2 border-t border-white/10">
                                        {m.sources.map((s, idx) => (
                                            <span
                                                key={idx}
                                                className="text-micro bg-lumin-bg/50 px-2 py-1 rounded-lg text-text-muted whitespace-nowrap border border-lumin-border"
                                            >
                                                📄 {s.title.split(" (Part")[0]}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-text-muted text-caption ml-4 mb-4"
                    >
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="h-1.5 w-1.5 rounded-full bg-accent-blue animate-bounce"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                        {t.chat.thinking}
                    </motion.div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className="p-4 pb-6 border-t border-lumin-border bg-lumin-bg/80 backdrop-blur-md">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    onUploadFile={handleFileUpload}
                    onIngestUrl={handleIngestUrl}
                    placeholder={t.chat.placeholder}
                />
            </div>
        </div>
    );
}