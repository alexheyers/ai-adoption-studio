"use client";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

/**
 * Editorial-Layout — Magazin-Style mit fixierter Top-Bar, schmaler Sidebar-Nav optional.
 * Genereller Gebrauch für Sub-Pages (Login, Onboarding, Voice, Dashboard, Report).
 * Die Hauptseiten (Landing, Pitch, Journey, Agents) verwenden ihr eigenes Layout.
 */
export function ShellLayout({
  children,
  title,
  eyebrow,
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <EditorialHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-8 lg:px-12 pt-16 pb-24">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          {title && (
            <h1 className="font-display text-display-md text-ink mb-10 max-w-3xl">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>
      <EditorialFooter />
    </div>
  );
}

/**
 * Header passt sich automatisch an: über dunklem Hero → transparent + helle Texte;
 * sobald gescrollt → cream backdrop-blur Bar mit dunklem Text.
 */
export function EditorialHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-500 ${
        dark
          ? "bg-transparent border-b border-transparent"
          : "bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70 border-b border-ink/15"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
          <span
            className={`font-display text-base sm:text-xl font-medium leading-none transition-colors duration-500 ${
              dark ? "text-paper" : "text-ink"
            }`}
          >
            AI-Adoption
          </span>
          <span
            className={`hidden sm:inline font-mono text-[10px] tracking-eyebrow mt-0.5 transition-colors duration-500 ${
              dark ? "text-gold" : "text-burgundy"
            }`}
          >
            STUDIO
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-eyebrow uppercase">
          {[
            ["customer-journey", "Journey"],
            ["agents", "Agents"],
            ["pitch", "Pitch"],
            ["dashboard", "Dashboard"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={`/${href}`}
              className={`transition-colors duration-300 hover-slide ${
                dark ? "text-paper/80 hover:text-gold" : "text-ink/70 hover:text-burgundy"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className={`inline-flex items-center gap-2 px-3 sm:px-5 py-2.5 text-[11px] sm:text-xs font-medium tracking-wide transition-all duration-300 shrink-0 ${
            dark
              ? "bg-paper text-ink hover:bg-gold"
              : "bg-ink text-paper hover:bg-burgundy"
          }`}
        >
          <span className="hidden sm:inline">Analyse starten</span>
          <span className="sm:hidden">Analyse</span>
          <span className="font-mono">→</span>
        </Link>
      </div>
    </header>
  );
}

/* GWA-Brutalism-Style Footer · schwarz, riesig, italic-Akzente */
export function EditorialFooter() {
  return (
    <footer className="brutal-bg-dark">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pt-24 pb-12">
        {/* MEGA-Wordmark */}
        <p className="hero-fade-in"
           style={{
             fontFamily: "var(--font-sans), sans-serif",
             fontWeight: 700,
             fontSize: "clamp(4rem, 13vw, 13rem)",
             lineHeight: 0.85,
             letterSpacing: "-0.06em",
             color: "#FAF6EE",
           }}>
          AI-Adoption<span style={{ color: "#B8945F" }}>.</span>
        </p>

        <div className="mt-16 grid md:grid-cols-12 gap-x-8 gap-y-12 pt-12 border-t border-paper/15">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-4">
              · Studio
            </p>
            <p className="text-paper/80 max-w-md leading-relaxed">
              Multi-Agent-System für KI-Adoption im Hospitality-Mittelstand. Senior-Consultant-Methode in Code übersetzt — gebaut für den DACH-Raum.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-4">
              · Inhalt
            </p>
            <ul className="space-y-3 font-mono text-[11px] tracking-eyebrow uppercase">
              <li><Link href="/customer-journey" className="text-paper hover-slide">Customer Journey</Link></li>
              <li><Link href="/agents"           className="text-paper hover-slide">Die 10 Agents</Link></li>
              <li><Link href="/pitch"            className="text-paper hover-slide">Pitch · 19.05.</Link></li>
              <li><Link href="/dashboard"        className="text-paper hover-slide">Dashboard</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-4">
              · Kontakt
            </p>
            <a href="mailto:a.heyers@gmail.com"
               className="block font-display italic text-paper text-3xl hover-slide leading-none"
               style={{ fontVariationSettings: '"WONK" 1' }}>
              a.heyers@gmail.com
            </a>
            <p className="mt-4 text-paper/60 font-mono text-[10px] tracking-eyebrow uppercase">
              BIZ 26 · KI-Boutique DACH<br />
              Made for Vibe Coding Bootcamp 2026
            </p>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-paper/15 flex flex-wrap justify-between gap-4 font-mono text-[10px] tracking-eyebrow uppercase text-paper/50">
          <span>· MMXXVI · Vol. I · No. 01</span>
          <span className="italic-accent text-gold">20 Jahre Hospitality → KI</span>
          <span>· Made by Alex Heyers</span>
        </div>
      </div>
    </footer>
  );
}
