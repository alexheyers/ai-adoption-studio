import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-Adoption-Studio · Hospitality-Strategie für die KI-Dekade",
  description:
    "Senior-Beratung im 30-Minuten-Format. Voice-Interview mit Ada, acht spezialisierte Agents, ein Pitch-Deck, ein ROI-Modell, eine Roadmap. Für Hotellerie und Gastronomie im DACH-Raum.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${bricolage.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
