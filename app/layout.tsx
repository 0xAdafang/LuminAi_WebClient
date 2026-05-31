import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "sonner";
import StarBackground from "@/components/shared/StarBackground";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
});

export const metadata: Metadata = {
    title: "LuminAI",
    description: "Next-generation document intelligence",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <StarBackground />
        <AuthProvider>
            <LanguageProvider>
                {children}
                <Toaster
                    position="top-right"
                    theme="dark"
                    toastOptions={{
                        style: {
                            background: '#111827',
                            border: '1px solid #1e293b',
                            color: '#f1f5f9',
                        },
                    }}
                />
            </LanguageProvider>
        </AuthProvider>
        </body>
        </html>
    );
}