"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShellLayout } from "@/components/Layout";
import { api } from "@/lib/api";

const SUB_SEGMENTS = [
  "Hotellerie",
  "Boutique-Hotel",
  "Stadthotel",
  "Ferienhotel",
  "Tagungshotel",
  "Hotelgruppe",
  "Familienbetrieb",
  "Gastronomie",
];

const SIZE_CLASSES = [
  { value: "S", label: "S — bis 25 Mitarbeitende" },
  { value: "M", label: "M — 26 bis 100 Mitarbeitende" },
  { value: "L", label: "L — 101 bis 250 Mitarbeitende" },
  { value: "XL", label: "XL — über 250 Mitarbeitende" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subSegment, setSubSegment] = useState(SUB_SEGMENTS[0]);
  const [sizeClass, setSizeClass] = useState("M");
  const [employees, setEmployees] = useState(50);
  const [locations, setLocations] = useState(1);
  const [annualRevenue, setAnnualRevenue] = useState(2_000_000);
  const [region, setRegion] = useState("");
  const [website, setWebsite] = useState("");
  const [painPoints, setPainPoints] = useState("");

  // Step 2 (Upload)
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});

  // Step 3 (Pfad-Wahl)
  const [path, setPath] = useState<"self_service" | "consultant">("self_service");

  async function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.onboard({
        full_name: fullName,
        phone: phone || null,
        company_name: companyName,
        sub_segment: subSegment,
        size_class: sizeClass,
        employees,
        locations,
        annual_revenue_eur: annualRevenue,
        region,
        website: website || null,
        pain_points_freitext: painPoints || null,
      });
      setCompanyId(res.company_id);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function uploadFiles() {
    if (!companyId) return;
    for (const f of files) {
      setUploadStatus((s) => ({ ...s, [f.name]: "lädt…" }));
      try {
        await api.upload(companyId, "other", f);
        setUploadStatus((s) => ({ ...s, [f.name]: "✓ verarbeitet" }));
      } catch (err: any) {
        setUploadStatus((s) => ({ ...s, [f.name]: `✕ ${err.message}` }));
      }
    }
  }

  function goToVoice() {
    if (!companyId) return;
    router.push(`/voice?company_id=${companyId}`);
  }

  return (
    <ShellLayout title="Onboarding">
      <div className="flex gap-3 mb-8 text-xs uppercase tracking-widest text-ink/60">
        <span className={step >= 1 ? "text-teal font-semibold" : ""}>1 · Profil</span>
        <span>·</span>
        <span className={step >= 2 ? "text-teal font-semibold" : ""}>2 · Daten</span>
        <span>·</span>
        <span className={step >= 3 ? "text-teal font-semibold" : ""}>3 · Pfad</span>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={submitStep1} className="card space-y-5 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Ihr Name</label>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required minLength={2} />
            </div>
            <div>
              <label className="label">Telefon (optional)</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Firmenname</label>
            <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required minLength={2} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Sub-Segment</label>
              <select className="input" value={subSegment} onChange={(e) => setSubSegment(e.target.value)}>
                {SUB_SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Größenklasse</label>
              <select className="input" value={sizeClass} onChange={(e) => setSizeClass(e.target.value)}>
                {SIZE_CLASSES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Mitarbeitende</label>
              <input type="number" min={1} className="input" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Standorte</label>
              <input type="number" min={1} className="input" value={locations} onChange={(e) => setLocations(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Jahresumsatz EUR</label>
              <input type="number" min={0} step={50000} className="input" value={annualRevenue} onChange={(e) => setAnnualRevenue(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Region/Stadt</label>
              <input className="input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="z.B. München, Berlin, Bayern" required />
            </div>
            <div>
              <label className="label">Website (optional)</label>
              <input className="input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="label">Wo drückt der Schuh aktuell? (Pain Points, freie Beschreibung)</label>
            <textarea
              className="input"
              rows={4}
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              placeholder="z.B. Personalmangel im Service, lange Antwortzeiten bei Anfragen, Bewertungs-Druck …"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Speichere…" : "Weiter zu Daten-Upload →"}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="card max-w-2xl space-y-5">
          <p className="text-sm text-ink/70">
            Optional: laden Sie Dokumente hoch, die Ada vor dem Gespräch kennen sollte. PDF (G&V, KPI-Reports), Excel (Belegungsdaten),
            Word/CSV. Alles bleibt vertraulich, RLS-geschützt.
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.csv,.docx,.doc,.txt"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="block w-full text-sm"
          />
          {files.length > 0 && (
            <ul className="text-sm space-y-1">
              {files.map((f) => (
                <li key={f.name} className="flex justify-between">
                  <span>{f.name} <span className="text-ink/50">({(f.size / 1024).toFixed(0)} KB)</span></span>
                  <span className="text-ink/60">{uploadStatus[f.name] || "—"}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between">
            <button className="btn-ghost" onClick={() => setStep(1)}>← zurück</button>
            <div className="flex gap-2">
              {files.length > 0 && (
                <button className="btn-secondary" onClick={uploadFiles}>Hochladen</button>
              )}
              <button className="btn-primary" onClick={() => setStep(3)}>Weiter →</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card max-w-2xl space-y-5">
          <p className="text-sm text-ink/70">
            Letzter Schritt vor dem Voice-Interview. Wir starten den Web-Research-Agent (sucht öffentliche Infos zu Ihrem Haus +
            Region) parallel zu Adas Vorbereitung. In ca. 2 Minuten kann das Gespräch starten.
          </p>
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="path"
                checked={path === "self_service"}
                onChange={() => setPath("self_service")}
                className="mt-1"
              />
              <div>
                <span className="font-medium">Self-Service</span>
                <p className="text-sm text-ink/70">Ich führe das Voice-Interview alleine durch.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer opacity-60">
              <input
                type="radio"
                name="path"
                checked={path === "consultant"}
                onChange={() => setPath("consultant")}
                className="mt-1"
                disabled
              />
              <div>
                <span className="font-medium">Berater-begleitet (bald verfügbar)</span>
                <p className="text-sm text-ink/70">Ein BIZ 26 Berater begleitet das Interview live.</p>
              </div>
            </label>
          </div>
          <div className="flex justify-between">
            <button className="btn-ghost" onClick={() => setStep(2)}>← zurück</button>
            <button className="btn-primary" onClick={goToVoice}>Voice-Interview starten →</button>
          </div>
        </div>
      )}
    </ShellLayout>
  );
}
