import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/authContext";
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
  title: "Joblyst — Rastreador de Postulaciones",
  description:
    "Gestiona tus postulaciones laborales, analiza estadísticas y organiza tu búsqueda de empleo",
  keywords: [
    "job tracker",
    "postulaciones",
    "búsqueda de empleo",
    "estadísticas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-black dark:text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          richColors
          expand
          closeButton
          theme="system"
        />
      </body>
    </html>
  );
}
