import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "sonner";

import StarBackground from "@/components/shared/StarBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MyAiTool",
    description: "L'intelligence documentaire nouvelle génération",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <StarBackground />

        <AuthProvider>
            <LanguageProvider>
                {children}
                <Toaster position="top-right" theme="dark" />
            </LanguageProvider>
        </AuthProvider>
        </body>
        </html>
    );
}