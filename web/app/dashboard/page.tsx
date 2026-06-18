"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShellLayout } from "@/components/Layout";
import { api } from "@/lib/api";

type Run = { id: string; status: string; current_step: string; created_at: string; completed_at: string | null };
type Company = { id: string; name: string; sub_segment?: string; region?: string; size_class?: string; employees?: number };

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString("de-DE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return s; }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return <span className="font-mono text-[10px] tracking-eyebrow uppercase text-tealDeep">✓ Fertig</span>;
  }
  if (status === "failed") {
    return <span className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">✕ Fehler</span>;
  }
  return <span className="font-mono text-[10px] tracking-eyebrow uppercase text-gold animate-pulse">● läuft …</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<{ profile: any; user: any; companies: Company[] } | null>(null);
  const [runsByCompany, setRunsByCompany] = useState<Record<string, Run[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.me().then(async (me: any) => {
      setData(me);
      const companies: Company[] = me.companies || [];
      const entries = await Promise.all(
        companies.map(async (c) => {
          try {
            const r = await api.listRuns(c.id);
            return [c.id, r.runs] as const;
          } catch {
            return [c.id, [] as Run[]] as const;
          }
        }),
      );
      setRunsByCompany(Object.fromEntries(entries));
    }).catch((e) => {
      if (String(e.message || "").includes("401")) {
        router.replace("/login?next=/dashboard");
        return;
      }
      setError(e.message);
    });
  }, [router]);

  if (error) {
    return (
      <ShellLayout title="Dashboard">
        <div className="border-l-2 border-burgundy pl-4 py-3">
          <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">Fehler</p>
          <p className="text-sm text-ink2 mt-1">{error}</p>
        </div>
      </ShellLayout>
    );
  }

  if (!data) {
    return <ShellLayout title="Dashboard"><p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 animate-pulse">Lade …</p></ShellLayout>;
  }

  const companies = data.companies || [];

  return (
    <ShellLayout eyebrow={`Angemeldet als ${data.profile?.full_name || data.user?.email || "—"}`} title="Deine Analysen">
      <div className="flex items-center justify-between border-b border-ink/15 pb-5 mb-10">
        <p className="text-ink2 text-sm max-w-xl leading-relaxed">
          Jede Analyse beginnt mit einem Gespräch mit Ada und mündet in einen Multi-Agent-Report.
          Hier findest du alle Durchläufe pro Unternehmen wieder.
        </p>
        <Link href="/onboarding" className="btn-primary shrink-0 ml-6">Neues Unternehmen →</Link>
      </div>

      {companies.length === 0 ? (
        <div className="border border-dashed border-rule rounded-sm px-8 py-14 text-center">
          <p className="font-display text-2xl text-ink">Noch keine Analyse</p>
          <p className="mt-3 text-ink2 text-sm">Leg dein Unternehmen an, lade Unterlagen hoch und sprich mit Ada.</p>
          <Link href="/onboarding" className="btn-primary mt-8 inline-block">Erste Analyse starten →</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {companies.map((c) => {
            const runs = runsByCompany[c.id] || [];
            return (
              <section key={c.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-ink leading-tight">{c.name}</h2>
                    <p className="mt-1 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                      {[c.sub_segment, c.region, c.size_class && `Größe ${c.size_class}`].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <Link href={`/voice?company_id=${c.id}`} className="btn-secondary shrink-0">Neue Analyse →</Link>
                </div>

                {runs.length === 0 ? (
                  <p className="mt-5 text-sm text-ink3">Noch kein Durchlauf — starte rechts oben eine neue Analyse.</p>
                ) : (
                  <ul className="mt-5 border-t border-ink/15">
                    {runs.map((r) => {
                      const running = r.status !== "completed" && r.status !== "failed";
                      return (
                        <li key={r.id}>
                          <Link
                            href={`/report/${r.id}`}
                            className="group flex items-center gap-6 py-4 border-b border-ink/10 hover:bg-paper2/60 -mx-3 px-3 transition-colors"
                          >
                            <span className="w-44 text-sm text-ink2">{fmtDate(r.created_at)}</span>
                            <span className="w-28"><StatusBadge status={r.status} /></span>
                            <span className="flex-1 text-sm text-ink3 truncate">
                              {r.status === "completed" ? "Beratungs-Report bereit" : running ? `Schritt: ${r.current_step}` : (r.current_step || "fehlgeschlagen")}
                            </span>
                            <span className="font-mono text-[11px] text-burgundy opacity-0 group-hover:opacity-100 transition-opacity">
                              {r.status === "completed" ? "Report ansehen →" : running ? "Fortschritt →" : "Details →"}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </ShellLayout>
  );
}
