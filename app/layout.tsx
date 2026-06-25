import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolAI — AI for Solana Crypto",
  description: "Rug detection, KOL scoring, gem finder, price prediction game — AI built for Solana degens. Free to use.",
  openGraph: {
    title: "SolAI — AI for Solana Crypto",
    description: "Rug detection, KOL scoring, gem finder + degen price prediction game. AI built for Solana. Free.",
    type: "website",
    siteName: "SolAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolAI — AI for Solana Crypto",
    description: "Rug detection, KOL scoring, gem finder + degen price prediction game. AI built for Solana. Free.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
