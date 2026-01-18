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

                <main className="flex-1 overflow-hidden relative">
                    <ChatWindow onUploadSuccess={triggerRefresh} />
                </main>
            </div>
        </div>
    );
}