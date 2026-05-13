"use client";

import { useState } from "react";
import { getSupabaseBrowser, isMockMode } from "@/lib/supabase-client";
import { ShellLayout } from "@/components/Layout";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("a.heyers@gmail.com");
  const [password, setPassword] = useState("TestVoice2026!");
  const [name, setName] = useState("Alex Heyers");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isMockMode) {
        router.push("/onboarding");
        return;
      }
      const sb = getSupabaseBrowser()!;
      if (mode === "password") {
        const { error: err } = await sb.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push("/onboarding");
      } else {
        const { error: err } = await sb.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: name },
          },
        });
        if (err) throw err;
        setSent(true);
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ShellLayout eyebrow="Anmelden · No. 02" title="Zugang zur Analyse">
      <div className="max-w-md">
        {sent ? (
          <div className="border-t border-ink/15 pt-8">
            <p className="eyebrow">Magic-Link gesendet</p>
            <h2 className="mt-3 font-display text-2xl">Check deine E-Mail</h2>
            <p className="text-sm text-ink2 mt-4 leading-relaxed">
              Login-Link an <span className="font-medium text-ink">{email}</span>. Klicken, fertig.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-1 font-mono text-[10px] tracking-eyebrow uppercase">
              <button
                type="button"
                onClick={() => setMode("password")}
                className={`px-3 py-1.5 border ${mode === "password" ? "border-burgundy text-burgundy" : "border-ink/20 text-ink3"}`}
              >
                Password (Test)
              </button>
              <button
                type="button"
                onClick={() => setMode("magic")}
                className={`px-3 py-1.5 border ${mode === "magic" ? "border-burgundy text-burgundy" : "border-ink/20 text-ink3"}`}
              >
                Magic-Link
              </button>
            </div>

            {mode === "magic" && (
              <div>
                <label className="label">Ihr Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
              </div>
            )}
            <div>
              <label className="label">E-Mail</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {mode === "password" && (
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="mt-2 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                  Test-User vorausgefüllt · Backend-Verify gegen Supabase
                </p>
              </div>
            )}
            {error && <p className="text-sm text-burgundy border-l-2 border-burgundy pl-3">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Sende…" : mode === "password" ? "Einloggen →" : "Magic-Link anfordern →"}
            </button>
            {isMockMode && (
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold border border-gold/40 bg-gold/5 px-3 py-2">
                Dev-Mode (keine Supabase-Keys) — Login simuliert
              </p>
            )}
          </form>
        )}
      </div>
    </ShellLayout>
  );
}
