"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShellLayout } from "@/components/Layout";
import { api } from "@/lib/api";

type Status = "backlog" | "in_progress" | "done";
const COLUMNS: { key: Status; label: string; hint: string }[] = [
  { key: "backlog", label: "Backlog", hint: "geplant" },
  { key: "in_progress", label: "In Arbeit", hint: "läuft gerade" },
  { key: "done", label: "Erledigt", hint: "live & messbar" },
];
const ORDER: Status[] = ["backlog", "in_progress", "done"];

const COMPLEXITY: Record<string, string> = { low: "niedrig", medium: "mittel", high: "hoch" };

export default function OperationsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{ run: any; results: Record<string, any> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ops, setOps] = useState<Record<string, Status>>({});

  useEffect(() => {
    api.getRun(params.id).then((res: any) => {
      setData(res);
      setOps((res.run?.operations as Record<string, Status>) || {});
    }).catch((e) => setError(e.message));
  }, [params.id]);

  const fr = data?.results?.full_report;
  const useCases: any[] = fr?.use_cases?.use_cases || [];
  const tools: any[] = fr?.tools?.recommendations || [];
  const toolFor = (name: string) => tools.find((t) => t.use_case_name === name);

  function statusOf(name: string): Status {
    return ops[name] || "backlog";
  }

  async function move(name: string, dir: -1 | 1) {
    const cur = statusOf(name);
    const idx = Math.min(ORDER.length - 1, Math.max(0, ORDER.indexOf(cur) + dir));
    const next = ORDER[idx];
    if (next === cur) return;
    const updated = { ...ops, [name]: next };
    setOps(updated); // optimistisch
    try {
      await api.setOperations(params.id, updated);
    } catch (e: any) {
      setOps(ops); // rollback
      setError(e.message);
    }
  }

  const counts = useMemo(() => {
    const c: Record<Status, number> = { backlog: 0, in_progress: 0, done: 0 };
    useCases.forEach((u) => { c[statusOf(u.name)]++; });
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCases, ops]);

  if (error) {
    return <ShellLayout title="Operations"><div className="border-l-2 border-burgundy pl-4 py-3"><p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">Fehler</p><p className="text-sm text-ink2 mt-1">{error}</p></div></ShellLayout>;
  }
  if (!data) {
    return <ShellLayout title="Operations"><p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 animate-pulse">Lade …</p></ShellLayout>;
  }
  if (data.run.status !== "completed" || useCases.length === 0) {
    return (
      <ShellLayout eyebrow="Operations" title="Umsetzung">
        <p className="text-ink2">Die Analyse ist noch nicht abgeschlossen oder hat keine Use-Cases.</p>
        <Link href={`/report/${params.id}`} className="btn-secondary mt-6 inline-block">Zum Report →</Link>
      </ShellLayout>
    );
  }

  return (
    <ShellLayout eyebrow={`${fr.company_name || "Unternehmen"} · Umsetzung`} title="Operations">
      <div className="flex items-center justify-between border-b border-ink/15 pb-5 mb-8">
        <p className="text-ink2 text-sm max-w-2xl leading-relaxed">
          Aus der Analyse werden Schritte. Schiebe jeden Use-Case von <em className="text-burgundy">Backlog</em> über
          {" "}<em className="text-burgundy">In Arbeit</em> zu <em className="text-burgundy">Erledigt</em> — der Stand wird gespeichert.
        </p>
        <Link href={`/report/${params.id}`} className="btn-secondary shrink-0 ml-6">← Report</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5 items-start">
        {COLUMNS.map((col) => (
          <div key={col.key} className="bg-paper2/50 border border-rule rounded-sm p-4 min-h-[60vh]">
            <div className="flex items-baseline justify-between mb-4">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-ink">{col.label}</p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">{counts[col.key]} · {col.hint}</p>
            </div>
            <div className="space-y-3">
              {useCases.filter((u) => statusOf(u.name) === col.key).map((u) => {
                const t = toolFor(u.name);
                const st = statusOf(u.name);
                const idx = ORDER.indexOf(st);
                return (
                  <div key={u.name} className="bg-paper border border-ink/12 rounded-sm p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                    <div className="flex items-start gap-2">
                      <p className="flex-1 font-display text-[15px] leading-snug text-ink">{u.name}</p>
                      {u.quick_win && <span className="shrink-0 font-mono text-[8px] tracking-eyebrow uppercase text-tealDeep border border-teal/40 bg-teal/5 px-1.5 py-0.5 rounded-sm">Quick Win</span>}
                    </div>
                    <p className="mt-2 text-[12.5px] text-ink2 leading-relaxed">{u.expected_impact}</p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] tracking-eyebrow uppercase text-ink3">
                      <span>{u.ai_pattern}</span>
                      <span>· Komplexität {COMPLEXITY[u.complexity] || u.complexity}</span>
                      {t?.primary_tool && <span>· {t.primary_tool}{t.monthly_cost_eur ? ` (${t.monthly_cost_eur}€/Mo)` : ""}</span>}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2">
                      <button onClick={() => move(u.name, -1)} disabled={idx === 0}
                        className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 hover:text-ink disabled:opacity-25 disabled:hover:text-ink3">← zurück</button>
                      <button onClick={() => move(u.name, 1)} disabled={idx === ORDER.length - 1}
                        className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy hover:text-burgundy2 disabled:opacity-25 disabled:hover:text-burgundy">weiter →</button>
                    </div>
                  </div>
                );
              })}
              {useCases.filter((u) => statusOf(u.name) === col.key).length === 0 && (
                <p className="text-[11px] text-ink3 font-mono tracking-eyebrow uppercase py-6 text-center">leer</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ShellLayout>
  );
}
