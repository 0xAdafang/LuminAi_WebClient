"use client";
import { Paperclip, Link, Send, X } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onUploadFile: (file: File) => void;
    onIngestUrl: (url: string) => void;
    placeholder: string;
}

const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export default function ChatInput({ onSendMessage, onUploadFile, onIngestUrl, placeholder }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [showUrlBar, setShowUrlBar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const urlInputRef = useRef<HTMLInputElement>(null);
    const { t } = useLanguage();

    const handleSubmit = () => {
        if (!input.trim()) return;
        onSendMessage(input.trim());
        setInput("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error(t.chatInput.errorPdfOnly);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error(t.chatInput.errorFileSize);
            return;
        }
        onUploadFile(file);
        if (e.target) e.target.value = "";
    };

    const handleUrlSubmit = () => {
        const url = urlInput.trim();
        if (!url) return;
        if (!URL_PATTERN.test(url)) {
            toast.error(t.chatInput.errorInvalidUrl);
            return;
        }
        onIngestUrl(url);
        setUrlInput("");
        setShowUrlBar(false);
    };

    const handleUrlToggle = () => {
        setShowUrlBar((prev) => !prev);
        setUrlInput("");
        if (!showUrlBar) {
            setTimeout(() => urlInputRef.current?.focus(), 150);
        }
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
            />

            {/* URL bar */}
            <AnimatePresence>
                {showUrlBar && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 6, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-2 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 glass p-2 rounded-xl border-accent-emerald/30">
                            <Link size={16} className="text-accent-emerald ml-1 flex-shrink-0" />
                            <input
                                ref={urlInputRef}
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); handleUrlSubmit(); }
                                    if (e.key === "Escape") handleUrlToggle();
                                }}
                                placeholder={t.chatInput.urlPlaceholder}
                                className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-body outline-none"
                            />
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!urlInput.trim()}
                                className="px-3 py-1 text-caption font-semibold bg-accent-emerald text-white rounded-lg hover:brightness-110 disabled:opacity-40 transition-all"
                            >
                                {t.chatInput.urlSubmit}
                            </button>
                            <button
                                onClick={handleUrlToggle}
                                className="p-1 text-text-muted hover:text-text-secondary transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main input */}
            <div className="relative flex items-end gap-2 glass p-2 rounded-2xl shadow-elevation-2 focus-within:border-accent-blue/40 transition-all">
                <div className="flex gap-0.5 pb-1">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-text-muted hover:text-accent-blue hover:bg-accent-blue-muted rounded-xl transition-all"
                        type="button"
                        title={t.chatInput.uploadTitle}
                    >
                        <Paperclip size={19} />
                    </button>
                    <button
                        onClick={handleUrlToggle}
                        className={`p-2 rounded-xl transition-all ${
                            showUrlBar
                                ? "text-accent-emerald bg-accent-emerald-muted"
                                : "text-text-muted hover:text-accent-emerald hover:bg-accent-emerald-muted"
                        }`}
                        type="button"
                        title={t.chatInput.urlTitle}
                    >
                        <Link size={19} />
                    </button>
                </div>

                <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-muted resize-none py-3 px-2 max-h-32 outline-none scrollbar-hide text-body"
                    style={{ minHeight: "44px" }}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="mb-1 p-2.5 bg-accent-blue text-white rounded-xl hover:bg-accent-blue-hover disabled:opacity-40 transition-all shadow-glow-blue"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}