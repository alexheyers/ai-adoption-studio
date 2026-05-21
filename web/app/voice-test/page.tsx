"use client";

/**
 * Voice-Sandbox · offizielles ElevenLabs Convai-Widget.
 * Web-Component <elevenlabs-convai agent-id="..."> macht den ganzen WebRTC-Handshake.
 * Funktioniert für Public-Agents (enable_auth: false).
 */

import Script from "next/script";
import Link from "next/link";
import { EditorialHeader } from "@/components/Layout";

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "";

export default function VoiceTestPage() {
  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
        async
        type="text/javascript"
      />
      <EditorialHeader />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-16 pb-12">
          <p className="eyebrow">Voice-Sandbox · Internal</p>
          <h1 className="mt-4 font-display text-display-md text-ink leading-tight max-w-3xl">
            Direkter Test mit <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>Ada</em>
          </h1>
          <p className="mt-6 max-w-2xl text-ink2 leading-relaxed">
            Offizielles ElevenLabs Convai-Widget. Klick auf den Phone-Button unten rechts → Mikrofon-Permission erteilen → Ada begrüßt dich von sich aus auf Deutsch.
          </p>
          <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
            Agent-ID: <code className="text-ink">{AGENT_ID || "FEHLT in .env.local"}</code>
            <span className="ml-4">Voice: Matilda · LLM: gpt-4o-mini · Sprache: DE</span>
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 lg:px-10 pb-16">
          <div className="card-paper p-10 grid md:grid-cols-2 gap-10">
            <div>
              <p className="eyebrow-ink">Anleitung</p>
              <ol className="mt-4 space-y-3 text-ink2 leading-relaxed list-decimal pl-5">
                <li>Klick unten rechts auf das schwebende <strong>&quot;Call Ada&quot;</strong>-Widget</li>
                <li>Browser fragt nach Mikrofon → erlauben</li>
                <li>Ada begrüßt mit:<br /><em className="text-burgundy text-sm">&quot;Hallo, ich bin Ada — die Stimme im Studio von Alex…&quot;</em></li>
                <li>Sprich normal weiter</li>
                <li>Klick zum Beenden auf das Hangup-Symbol im Widget</li>
              </ol>

              <p className="eyebrow-ink mt-10">Wenn nichts passiert</p>
              <ul className="mt-4 space-y-2 text-sm text-ink2">
                <li>· Browser-Console öffnen (Cmd+Option+J)</li>
                <li>· Nach <code>elevenlabs</code> oder <code>convai</code> filtern</li>
                <li>· Errors screenshotten</li>
              </ul>
            </div>

            <div className="bg-paper border border-ink/15 p-8">
              <p className="eyebrow-ink">Was Ada gerade kann</p>
              <p className="mt-4 text-sm text-ink2 leading-relaxed">
                Im Voice-Sandbox spricht Ada ohne Pre-Brief — sie kennt nur ihre Voice-Coach-Persona aus dem System-Prompt. Du kannst sie zu allem fragen, sie führt das Gespräch im interviewenden Stil — direkt, kein Sales-Talk.
              </p>
              <p className="mt-4 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                Voll-Flow mit Pre-Brief: <Link href="/login" className="link-editorial">Login → Onboarding → /voice</Link>
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-ink/15 bg-paper2">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-10">
            <p className="eyebrow-ink">Debug</p>
            <p className="mt-3 text-sm text-ink2">
              Dieses Widget connectet direkt mit ElevenLabs Cloud (WebRTC). Es braucht KEIN VPS-Deployment — lokal funktioniert genauso wie deployed.
              Falls&apos;s lokal nicht geht, geht&apos;s auch deployed nicht — wäre Tier-/Voice-/Config-Problem, kein Hosting-Problem.
            </p>
          </div>
        </section>
      </main>

      {/* Das offizielle Widget — rendert sich selbst unten rechts als floating button */}
      {AGENT_ID && (
        <elevenlabs-convai agent-id={AGENT_ID}></elevenlabs-convai>
      )}
    </>
  );
}

// Custom-Element-Typen sind global in app/voice/page.tsx deklariert.
