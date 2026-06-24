import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BasedMind — AI for Solana Crypto",
  description: "The smartest AI assistant on Solana. Real-time prices, DeFi data, trending tokens, and more. Powered by $BMIND.",
  openGraph: {
    title: "BasedMind — AI for Solana Crypto",
    description: "Real-time crypto AI powered by $BMIND on Solana.",
    images: ["/logo.png"],
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
