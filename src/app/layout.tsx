import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#130e0c",
};

export const metadata: Metadata = {
  title: "Megasnem — Mensageiro com Assistente de IA",
  description:
    "Megasnem — Mensageiro transparente e moderno com Assistente de IA para revisão de mensagens, sugestões inteligentes e análise da conversa.",
  openGraph: {
    title: "Megasnem — Mensageiro com Assistente de IA",
    description:
      "Megasnem — Mensageiro transparente e moderno com Assistente de IA para revisão de mensagens, sugestões inteligentes e análise da conversa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <body className="min-h-screen bg-[#130e0c] text-[#f2e0db] antialiased select-none">
        {children}
      </body>
    </html>
  );
}
