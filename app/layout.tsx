import { AuthProvider } from "@/context/AuthContext";
import StarBackground from "@/components/shared/StarBackground";
import "./globals.css";
import {Toaster} from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" className="dark">
        <body className="bg-[#030712] text-slate-100 antialiased">
        <AuthProvider>
            <Toaster richColors position="top-right" />
            <StarBackground />
            <main className="relative z-10">
                {children}
            </main>
        </AuthProvider>
        </body>
        </html>
    );
}