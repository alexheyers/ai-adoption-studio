"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { ShellLayout } from "@/components/Layout";
import { api } from "@/lib/api";


const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "";

// Schritte der Vorbereitung — spiegeln die echte Backend-Pipeline in /voice/start.
const PREP_STEPS = [
  { k: "Unterlagen werden gelesen", d: "PDF · Excel · CSV → Klartext + KPIs" },
  { k: "Web-Research zu Haus & Region", d: "öffentliche Signale, Wettbewerb, Lage" },
  { k: "Pre-Audit: Hypothesen werden gebildet", d: "wo drückt der Schuh — vor dem Gespräch" },
  { k: "Fragen aus dem 105er-Pool selektiert", d: "passend zu Branche, Größe, Pain Points" },
  { k: "Ada-Session wird vorbereitet", d: "Briefing an die Stimme übergeben" },
];

type Phase = "idle" | "preparing" | "ready" | "live" | "wrapping" | "done" | "error";

export default function VoicePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-8 lg:px-12 pt-16 pb-24 text-ink2">Lade …</div>}>
      <VoicePageInner />
    </Suspense>
  );
}

function VoicePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const companyId = params.get("company_id");

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [preBrief, setPreBrief] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const widgetRef = useRef<HTMLElement | null>(null);

  // Vorbereitungs-Fortschritt
  const [prepStep, setPrepStep] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(0);
  const [prepDocs, setPrepDocs] = useState<any[]>([]);
  const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (prepTimerRef.current) clearInterval(prepTimerRef.current); }, []);

  // Vorbereitung starten
  async function prepare() {
    if (!companyId) {
      setError("Kein company_id in URL — bitte zurück zum Onboarding.");
      setPhase("error");
      return;
    }
    setPhase("preparing");
    setError(null);
    setPrepStep(0);
    setPrepSeconds(0);
    setPrepDocs([]);

    // Reale Unterlagen laden, die Ada gerade liest (für die Anzeige)
    api.listDocuments(companyId).then((r) => setPrepDocs(r.documents || [])).catch(() => undefined);

    // Animierter Fortschritt: alle 2s ein Schritt weiter, hält am letzten Schritt
    // bis die echte Antwort da ist. 1s-Takt für den Sekunden-Zähler.
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    let tick = 0;
    prepTimerRef.current = setInterval(() => {
      tick += 1;
      setPrepSeconds(tick);
      if (tick % 2 === 0) setPrepStep((s) => Math.min(s + 1, PREP_STEPS.length - 1));
    }, 1000);

    try {
      // Web-Research parallel (Fire-and-forget)
      api.startResearch(companyId).catch(() => undefined);
      const res = await api.startVoice(companyId);
      setSessionId(res.session_id);
      setConversationId(res.conversation_id || null);
      setPreBrief(res.pre_brief || {});
      setQuestions(res.selected_questions || []);
      setPhase("ready");
    } catch (err: any) {
      setError(err.message);
      setPhase("error");
    } finally {
      if (prepTimerRef.current) {
        clearInterval(prepTimerRef.current);
        prepTimerRef.current = null;
      }
    }
  }

  // Conversation-Events vom Widget abfangen
  useEffect(() => {
    function onCall(ev: Event) {
      console.log("[voice]", ev.type, (ev as any).detail);
      if (ev.type === "convai-call-start") {
        setPhase("live");
        setSeconds(0);
        timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      }
      if (ev.type === "convai-call-end") {
        if (timerRef.current) clearInterval(timerRef.current);
        finishAndRun();
      }
    }
    window.addEventListener("convai-call-start", onCall);
    window.addEventListener("convai-call-end", onCall);
    return () => {
      window.removeEventListener("convai-call-start", onCall);
      window.removeEventListener("convai-call-end", onCall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, companyId]);

  async function finishAndRun(opts: { manualTrigger?: boolean } = {}) {
    setPhase("wrapping");
    try {
      // Versuche aktuelles Transcript von ElevenLabs zu pullen (Pull-API)
      let transcript = "(Transcript wird via Webhook nachgereicht)";
      let duration: number | undefined = seconds || undefined;
      if (conversationId && sessionId) {
        try {
          const tr = await api.fetchTranscript({ conversation_id: conversationId, session_id: sessionId });
          if (tr.transcript && tr.transcript.length > 30) {
            transcript = tr.transcript;
          }
          if (tr.duration_seconds) duration = tr.duration_seconds;
        } catch (err) {
          console.warn("[voice] Transcript-Pull fehlgeschlagen, fahre mit Platzhalter fort", err);
        }
      }
      if (sessionId) {
        await api.finishVoice({ session_id: sessionId, transcript, duration_seconds: duration });
      }
      if (companyId && sessionId) {
        const run = await api.startRun({ company_id: companyId, voice_session_id: sessionId });
        router.push(`/report/${run.run_id}`);
      }
    } catch (err: any) {
      setError(err.message);
      setPhase("error");
    }
  }

  async function triggerAnalysisNow() {
    // Manuelle "Jetzt analysieren"-Aktion mid-conversation
    if (timerRef.current) clearInterval(timerRef.current);
    await finishAndRun({ manualTrigger: true });
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <ShellLayout eyebrow="Voice-Interview · No. 03" title="Gespräch mit Ada">
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
        async
        type="text/javascript"
      />

      {error && (
        <div className="mb-8 border-l-2 border-burgundy pl-4 py-2">
          <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">Fehler</p>
          <p className="text-sm text-ink2 mt-1">{error}</p>
        </div>
      )}

      {phase === "idle" && (
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
          <div>
            <p className="eyebrow-ink">Bereit?</p>
            <p className="mt-4 text-lg text-ink2 leading-relaxed">
              Du sprichst jetzt rund 30 Minuten mit Ada — der Voice-Interview-Coach im Studio.
              Sie kennt deinen Namen, deine Firma, deine Pain Points aus dem Onboarding und arbeitet
              hypothesen-getrieben durch deine Hotel-Realität.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-ink2">
              <li className="flex gap-3"><span className="text-burgundy mt-1">·</span>Ruhige Umgebung, gutes Mikrofon</li>
              <li className="flex gap-3"><span className="text-burgundy mt-1">·</span>Ehrlich antworten — Ada sammelt, sie verkauft nichts</li>
              <li className="flex gap-3"><span className="text-burgundy mt-1">·</span>Du kannst jederzeit beenden, der Verlauf bleibt</li>
            </ul>
            <button onClick={prepare} className="btn-primary mt-10">
              Vorbereitung starten <span className="font-mono">→</span>
            </button>
          </div>
          <aside className="border-l border-ink/15 pl-8">
            <p className="eyebrow">Was passiert dahinter</p>
            <ol className="mt-6 space-y-4 text-sm text-ink2">
              <li><strong>1.</strong> Web-Research-Agent recherchiert dein Haus + Region (parallel)</li>
              <li><strong>2.</strong> Pre-Brief-Builder selektiert 13 Fragen aus dem 105er-Pool nach deinem Profil</li>
              <li><strong>3.</strong> ElevenLabs-Agent &quot;Ada&quot; bekommt System-Prompt + erste Frage injiziert</li>
              <li><strong>4.</strong> Nach Ende: Multi-Agent-Pipeline startet automatisch</li>
              <li><strong>5.</strong> Report inkl. PPTX/Excel/PDF auf /report/[id]</li>
            </ol>
          </aside>
        </div>
      )}

      {phase === "preparing" && (
        <div className="max-w-3xl">
          <p className="eyebrow-ink">Vorbereitung läuft …</p>
          <p className="mt-4 font-display text-display-sm text-ink leading-tight">
            Ada studiert dein Haus.
          </p>

          {/* Fortschrittsbalken */}
          <div className="mt-8 h-[3px] w-full bg-ink/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-teal transition-all duration-700 ease-out"
              style={{ width: `${((prepStep + 1) / PREP_STEPS.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
            Schritt {Math.min(prepStep + 1, PREP_STEPS.length)} / {PREP_STEPS.length} · {prepSeconds}s
          </p>

          <div className="mt-9 grid md:grid-cols-2 gap-10">
            {/* Pipeline-Schritte */}
            <ol className="space-y-4">
              {PREP_STEPS.map((s, i) => {
                const done = i < prepStep;
                const active = i === prepStep;
                return (
                  <li key={s.k} className="flex gap-3 items-start">
                    <span
                      className={`mt-0.5 grid place-items-center h-5 w-5 rounded-full text-[10px] font-mono shrink-0 ${
                        done ? "bg-teal/15 text-tealDeep" : active ? "bg-burgundy/10 text-burgundy" : "bg-ink/5 text-ink3"
                      }`}
                    >
                      {done ? "✓" : active ? <span className="h-1.5 w-1.5 rounded-full bg-burgundy animate-pulse" /> : i + 1}
                    </span>
                    <div className={done ? "opacity-90" : active ? "" : "opacity-40"}>
                      <p className={`text-sm leading-snug ${active ? "text-ink font-medium" : "text-ink2"}`}>
                        {s.k}{active && <span className="text-ink3"> …</span>}
                      </p>
                      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-0.5">{s.d}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Unterlagen, die gerade gelesen werden */}
            <div className="border-l border-ink/15 pl-6">
              <p className="eyebrow">Unterlagen · Ada liest mit</p>
              {prepDocs.length === 0 ? (
                <p className="mt-4 text-sm text-ink3 leading-relaxed">
                  Keine Dokumente hochgeladen — Ada startet mit Profil &amp; Web-Research.
                </p>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {prepDocs.map((d) => {
                    const ok = d.parser_status === "parsed";
                    const failed = d.parser_status === "failed";
                    return (
                      <li key={d.id} className="flex items-center gap-2.5 text-sm">
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            ok ? "bg-teal" : failed ? "bg-burgundy" : "bg-gold animate-pulse"
                          }`}
                        />
                        <span className="truncate text-ink2">{d.filename}</span>
                      </li>
                    );
                  })}
                  <li className="pt-1 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                    {prepDocs.filter((d) => d.parser_status === "parsed").length} / {prepDocs.length} verarbeitet
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === "ready" && (
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl">
          <div className="md:col-span-2">
            <p className="eyebrow-ink">Ada ist bereit</p>
            <p className="mt-4 font-display text-display-sm text-ink leading-tight">
              Klick unten rechts auf <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>&quot;Call Ada&quot;</em>
            </p>
            <p className="mt-6 text-ink2 leading-relaxed max-w-xl">
              Das schwebende Phone-Icon unten rechts startet den Voice-Call. Browser fragt nach Mikrofon, dann begrüßt Ada dich direkt mit deinem Namen.
            </p>

            <div className="mt-10 border-t border-ink/15 pt-6">
              <p className="eyebrow-ink">Pre-Brief · was Ada vorab weiß</p>
              <dl className="mt-4 text-sm space-y-2">
                <div className="flex"><dt className="w-32 text-ink3 font-mono text-[10px] tracking-eyebrow uppercase pt-0.5">Person</dt><dd>{preBrief?.user_name || "—"}</dd></div>
                <div className="flex"><dt className="w-32 text-ink3 font-mono text-[10px] tracking-eyebrow uppercase pt-0.5">Firma</dt><dd>{preBrief?.company_name || "—"}</dd></div>
                <div className="flex"><dt className="w-32 text-ink3 font-mono text-[10px] tracking-eyebrow uppercase pt-0.5">Fragen</dt><dd>{questions.length} selektiert aus 105er-Pool</dd></div>
                <div className="flex"><dt className="w-32 text-ink3 font-mono text-[10px] tracking-eyebrow uppercase pt-0.5">Dauer</dt><dd>~30 Min Cap</dd></div>
              </dl>
            </div>
          </div>

          <aside className="border-l border-ink/15 pl-8">
            <p className="eyebrow">Themen</p>
            <ol className="mt-6 space-y-4 text-xs text-ink2">
              {questions.map((q: any, i: number) => (
                <li key={q.id || i}>
                  <p className="font-mono text-[9px] tracking-eyebrow uppercase text-burgundy">{String(i+1).padStart(2,"0")} · {q.category}</p>
                  <p className="mt-1 leading-snug">{q.question}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}

      {phase === "live" && (
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-3 w-3 rounded-full bg-burgundy animate-pulse" />
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">Live</p>
            <p className="font-display text-3xl tabular-nums">{mm}:{ss}</p>
          </div>

          <p className="text-lg text-ink2 leading-relaxed max-w-2xl">
            Sprich entspannt mit Ada. Wenn du beendest (Hangup-Symbol im Widget), startet die Multi-Agent-Analyse automatisch.
          </p>

          {/* Manueller Trigger · für den Fall dass das Gespräch früher abgebrochen wird oder das Widget hängt */}
          <div className="mt-12 border-t border-ink/15 pt-8 grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <p className="eyebrow-ink">Schon genug gesagt?</p>
              <p className="mt-3 text-sm text-ink2 leading-relaxed max-w-lg">
                Du kannst die Analyse jederzeit jetzt anstoßen. Ada-Transkript wird gespeichert,
                die Multi-Agent-Pipeline läuft mit dem, was bisher besprochen wurde — du musst nicht warten,
                bis die 30 Minuten voll sind.
              </p>
            </div>
            <div className="md:text-right">
              <button
                onClick={triggerAnalysisNow}
                className="inline-flex items-center gap-3 bg-ink text-paper hover:bg-burgundy transition-colors px-6 py-3.5 text-sm font-medium tracking-wide"
              >
                Jetzt analysieren
                <span className="font-mono">→</span>
              </button>
              <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                Pipeline-Start sofort
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === "wrapping" && (
        <div className="max-w-2xl">
          <p className="eyebrow-ink">Pipeline startet</p>
          <p className="mt-4 font-display text-2xl text-ink leading-tight">
            Multi-Agent-Run läuft — Weiterleitung zum Report …
          </p>
        </div>
      )}

      {/* Das offizielle Widget.
          WICHTIG (Fix 18.06.): Der volle Per-Call-Prompt (Persona + Kontext + Dokument-Recap,
          ~24k Zeichen) geht als override-prompt direkt in den Agent-Prompt — NICHT mehr als
          Dynamic Variable {{briefing_context}}. ElevenLabs droppt Dynamic Variables ab ~ein paar k
          Zeichen still, weshalb Ada vorher keinerlei Dokument-Kontext hatte. Prompt-Override hat
          ein großes Limit und ist in den Agent-Security-Settings freigeschaltet (agent.prompt.prompt). */}
      {(phase === "ready" || phase === "live") && AGENT_ID && preBrief?.system_prompt && (
        <elevenlabs-convai
          ref={widgetRef as any}
          agent-id={AGENT_ID}
          override-prompt={preBrief.system_prompt}
          override-first-message={preBrief.first_message}
          dynamic-variables={JSON.stringify(preBrief.dynamic_variables || {})}
        ></elevenlabs-convai>
      )}
    </ShellLayout>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id"?: string;
          "dynamic-variables"?: string;
          "override-prompt"?: string;
          "override-first-message"?: string;
        },
        HTMLElement
      >;
    }
  }
}
