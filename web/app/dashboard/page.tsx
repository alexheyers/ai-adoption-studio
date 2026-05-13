"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShellLayout } from "@/components/Layout";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.me().then(setData).catch((e) => {
      // 401 → User nicht eingeloggt → ab zum Login
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
        <div className="card border-l-2 border-burgundy pl-4 py-3">
          <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">Fehler</p>
          <p className="text-sm text-ink2 mt-1">{error}</p>
        </div>
      </ShellLayout>
    );
  }

  if (!data) {
    return <ShellLayout title="Dashboard"><div className="card">Lade …</div></ShellLayout>;
  }

  return (
    <ShellLayout title="Dashboard">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Profil</h3>
          <p className="text-sm">{data.profile?.full_name || "—"}</p>
          <p className="text-sm text-ink/60">{data.profile?.email || data.user?.email}</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Firmen ({data.companies?.length || 0})</h3>
          <ul className="text-sm space-y-1">
            {(data.companies || []).map((c: any) => (
              <li key={c.id}>
                <span className="font-medium">{c.name}</span>
                <span className="text-ink/60"> · {c.sub_segment} · {c.region}</span>
              </li>
            ))}
          </ul>
          <Link href="/onboarding" className="btn-secondary mt-4 inline-block">Neue Analyse</Link>
        </div>
      </div>
    </ShellLayout>
  );
}
