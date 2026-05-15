"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/#build-log",      label: "Build-Log" },
  { href: "/pitch",           label: "Pitch" },
  { href: "/agents",          label: "Agents" },
  { href: "/customer-journey", label: "Journey" },
  { href: "/dashboard",       label: "Dashboard" },
];

const PAGE_CONTEXTS: Record<string, string> = {
  "/pitch":            "Pitch",
  "/agents":           "Die 10 Agents",
  "/customer-journey": "Customer Journey · 5 Phasen",
  "/dashboard":        "Live Dashboard",
  "/voice":            "Voice-Interview mit Ada",
  "/voice-test":       "Voice-Test",
  "/onboarding":       "Onboarding",
  "/login":            "Login",
  "/picker":           "Hotel-Picker",
};

function pageContext(pathname: string): string | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/report/")) return "Executive Report";
  return PAGE_CONTEXTS[pathname] || null;
}

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
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const ctx = pageContext(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/#build-log") return false;
    if (href === "/") return isHome;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper border-b border-ink/15">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 h-16 lg:h-20 flex items-center gap-3">
          {/* Back-Pfeil · NUR auf Sub-Pages */}
          {!isHome && (
            <Link
              href="/"
              aria-label="Zurück zur Startseite"
              className="group inline-flex items-center gap-2 pr-3 sm:pr-4 mr-2 sm:mr-3 border-r border-ink/15 text-ink/60 hover:text-burgundy transition-colors duration-300"
            >
              <span className="font-mono text-base leading-none transition-transform group-hover:-translate-x-1">←</span>
              <span className="hidden sm:inline font-mono text-[10px] tracking-eyebrow uppercase">Home</span>
            </Link>
          )}

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="font-display text-base sm:text-xl font-medium leading-none text-ink">
              AI-Adoption
            </span>
            <span className="hidden sm:inline font-mono text-[10px] tracking-eyebrow mt-0.5 text-burgundy">
              STUDIO
            </span>
          </Link>

          {/* Page-Kontext zwischen Logo und Nav */}
          {ctx && (
            <>
              <span className="hidden lg:inline font-mono text-[10px] ml-3 text-ink/25">·</span>
              <span className="hidden lg:inline font-mono text-[10px] tracking-eyebrow uppercase text-ink/55">
                {ctx}
              </span>
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Primary Nav · Desktop */}
          <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] tracking-eyebrow uppercase">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative transition-colors duration-300 ${
                    active ? "text-burgundy" : "text-ink/70 hover:text-burgundy"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-2 left-0 right-0 h-px bg-burgundy"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Contact als rechter Anker · ersetzt Generic-CTA */}
          <a
            href="mailto:a.heyers@gmail.com"
            className="hidden md:inline-flex items-center gap-2 ml-7 pl-7 border-l border-ink/15 font-mono text-[11px] tracking-eyebrow uppercase text-ink hover:text-burgundy transition-colors duration-300"
          >
            <span>Kontakt</span>
            <span className="font-mono">→</span>
          </a>

          {/* Mobile Menü-Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen"
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 text-ink hover:text-burgundy transition-colors duration-300"
          >
            <span className="font-mono text-sm">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Mobile-Menü */}
        {mobileOpen && (
          <div className="md:hidden bg-paper border-t border-ink/15">
            <nav className="mx-auto max-w-[1600px] px-4 sm:px-6 py-5 flex flex-col gap-4 font-mono text-xs tracking-eyebrow uppercase">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={active ? "text-burgundy" : "text-ink/80 hover:text-burgundy"}
                  >
                    {item.label}
                    {active && <span className="ml-2 text-burgundy">·</span>}
                  </Link>
                );
              })}
              <a
                href="mailto:a.heyers@gmail.com"
                className="text-ink/60 pt-4 mt-1 border-t border-ink/15"
              >
                Kontakt · a.heyers@gmail.com
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
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
              Alex Heyers baut. Vibe Coding Bootcamp 2026. Multi-Agent-System für Hospitality, dokumentiert in 26 LinkedIn-Posts und einem täglichen Build-Log. Hier siehst du jeden Schritt.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-4">
              · Inhalt
            </p>
            <ul className="space-y-3 font-mono text-[11px] tracking-eyebrow uppercase">
              <li><Link href="/#build-log"       className="text-paper hover-slide">Build-Log</Link></li>
              <li><Link href="/agents"           className="text-paper hover-slide">Die 10 Agents</Link></li>
              <li><Link href="/pitch"            className="text-paper hover-slide">Pitch · 19.05.</Link></li>
              <li><Link href="/customer-journey" className="text-paper hover-slide">Customer Journey</Link></li>
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
