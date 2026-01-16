"use client";
import { Paperclip, Link, Send } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onUploadFile: (file: File) => void;
    onIngestUrl: (url: string) => void;
}

export default function ChatInput({ onSendMessage, onUploadFile, onIngestUrl }: ChatInputProps) {
    const [input, setInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Veuillez sélectionner un fichier PDF.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("La taille du fichier dépasse la limite de 10 Mo.");
            return;
        }

        onUploadFile(file);

        if (e.target) e.target.value = "";
    };

    const handleUrlSubmit = () => {
        const url = prompt("Collez l'URL à indexer :");
        if (!url) return;

        const urlPattern = new RegExp('^(https?:\\/\\/)?'+
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
            '((\\d{1,3}\\.){3}\\d{1,3}))'+
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
            '(\\?[;&a-z\\d%_.~+=-]*)?'+
            '(\\#[-a-z\\d_]*)?$','i');

        if (!urlPattern.test(url)) {
            toast.error("Veuillez entrer une URL valide (ex: https://...)");
            return;
        }

        onIngestUrl(url);
    };


    return (
        <div className="relative w-full max-w-4xl mx-auto p-4">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative flex items-end gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-2 rounded-2xl shadow-2xl focus-within:border-blue-500/50 transition-all"
            >
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                    type="button"
                >
                    <Paperclip size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                />

                <button
                    onClick={handleUrlSubmit}
                    className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                    type="button"
                >
                    <Link size={20} />
                </button>

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
                    placeholder="Posez une question à votre IA..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-2 px-1 max-h-40 outline-none"
                />

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                    <Send size={18} />
                </button>
            </motion.div>
        </div>
    );
}