import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BasedMind — AI for Base Crypto",
  description: "The smartest AI assistant on Base. Real-time prices, DeFi data, trending tokens, gas tracker and more. Powered by $BMIND.",
  openGraph: {
    title: "BasedMind — AI for Base Crypto",
    description: "Real-time crypto AI powered by $BMIND on Base blockchain.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
