"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [refreshSignal, setRefreshSignal] = useState(0);

    useEffect(() => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (mounted && !token) {
            router.push("/");
        }
    }, [mounted, token, router]);

    if (!mounted) {
        return <div className="h-screen w-full bg-[#030712]" />;
    }

    if (!token) {
        return <div className="h-screen w-full bg-[#030712]" />;
    }

    const triggerRefresh = () => setRefreshSignal(prev => prev + 1);

    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden">

            <Sidebar refreshSignal={refreshSignal} />

            <div className="flex-1 relative flex flex-col h-full overflow-hidden border-l border-white/5">

                <header className="p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h1 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Session de recherche active
                        </h1>
                    </div>
                    <div className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-500 font-mono">
                        GO-BACKEND: ONLINE
                    </div>
                </header>


                <main className="flex-1 overflow-hidden relative">
                    <ChatWindow onUploadSuccess={triggerRefresh} />
                </main>
            </div>
        </div>
    );
}