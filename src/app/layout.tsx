import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree, Rakkas, Cairo } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const rakkas = Rakkas({ variable: "--font-rakkas", subsets: ["arabic", "latin"], weight: ["400"], display: "swap" });
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"], weight: ["300", "400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "AM Automotive — Heliopolis, Cairo",
  description:
    "Nine cars, nineteen model years, 9,000 to 175,000 km. A concept page built entirely from AM Automotive's own published material.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      translate="no"
      className={`${cormorant.variable} ${figtree.variable} ${rakkas.variable} ${cairo.variable} h-full antialiased`}
    >
      <head>
        <noscript>
          <style>{`
            [data-ledger] [data-ledger-item], [data-ledger-item] {
              opacity: 1 !important; animation: none !important;
            }
            [data-ledger-item]::before { transform: scaleX(1) !important; animation: none !important; }
          `}</style>
        </noscript>
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
