import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Proyecto Euclides — Algoritmos RSA Interactivos",
  description:
    "Aprende el Algoritmo de Euclides y el Algoritmo de Euclides Extendido en el contexto de la criptografía RSA. Visualiza cada paso, controla la reproducción y practica con ejercicios.",
  keywords: ["RSA", "algoritmo de euclides", "criptografía", "matemáticas", "educación"],
  authors: [{ name: "Proyecto Euclides" }],
  openGraph: {
    title: "Proyecto Euclides — Algoritmos RSA Interactivos",
    description: "Visualiza el Algoritmo de Euclides Extendido aplicado a RSA, paso a paso.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="flex min-h-dvh flex-col relative">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
