"use client";

import { useEffect, useState } from "react";

/**
 * Zeigt eine ehrliche, selbst-aktualisierende Relativzeit zum letzten Build-Log-Stand.
 * Server + erster Client-Render zeigen das absolute Datum (kein Hydration-Mismatch),
 * danach ersetzt der Effect es durch "vor X Std/Tagen". Keine erfundenen Werte.
 */
export function LiveStamp({ iso }: { iso: string }) {
  const abs = new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const [rel, setRel] = useState<string | null>(null);

  useEffect(() => {
    const diffH = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
    if (diffH < 1) setRel("vor wenigen Minuten");
    else if (diffH < 24) setRel(`vor ${diffH} Std`);
    else {
      const d = Math.floor(diffH / 24);
      setRel(d === 1 ? "vor 1 Tag" : `vor ${d} Tagen`);
    }
  }, [iso]);

  return <span suppressHydrationWarning>{rel ?? abs}</span>;
}
