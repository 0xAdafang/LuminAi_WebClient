"use client";
import { Paperclip, Link, Send } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onUploadFile: (file: File) => void;
    onIngestUrl: (url: string) => void;
    placeholder: string;
}

export default function ChatInput({ onSendMessage, onUploadFile, onIngestUrl, placeholder }: ChatInputProps) {
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

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
            />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative flex items-end gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-2 rounded-2xl shadow-2xl focus-within:border-blue-500/50 transition-all"
            >

                <div className="flex gap-1 pb-1">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                        type="button"
                        title="Uploader un PDF"
                    >
                        <Paperclip size={20} />
                    </button>

                    <button
                        onClick={handleUrlSubmit}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all"
                        type="button"
                        title="Ajouter une URL"
                    >
                        <Link size={20} />
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
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-3 px-2 max-h-32 outline-none scrollbar-hide"
                    style={{ minHeight: "44px" }}
                />


                <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="mb-1 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/20"
                >
                    <Send size={18} />
                </button>
            </motion.div>
        </div>
    );
}