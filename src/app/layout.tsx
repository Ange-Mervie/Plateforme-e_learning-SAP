import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import { ProgressProvider } from "@/context/progress-context";
import Header from "@/components/site/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ELEVATE By IBN — Plateforme e-learning SAP",
    template: "%s | ELEVATE By IBN",
  },
  description:
    "Plateforme e-learning spécialisée SAP : formations pratiques, cas métier et certifications pour les équipes fonctionnelles, techniques et data.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            <ProgressProvider>
              <Suspense fallback={null}>
                <Header />
              </Suspense>
              {children}
            </ProgressProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
