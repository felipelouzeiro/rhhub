import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ACADEMIC_NOTICE, ORG_NAME, SITE_NAME } from "@/lib/site";

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
    default: `${SITE_NAME} · ${ORG_NAME}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: `Comunicados, agenda e recursos — ${ORG_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F8FA] text-[#1F2937]">
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#F2C94C] focus:px-3 focus:py-2 focus:text-black"
        >
          Ir para o conteúdo
        </a>
        <p
          className="border-b border-[#E5E7EB] bg-white px-4 py-2 text-center text-xs text-[#6B7280]"
          role="note"
        >
          {ACADEMIC_NOTICE}
        </p>
        <div id="conteudo-principal" className="flex flex-1 flex-col">
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
