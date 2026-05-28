#!/usr/bin/env node
/**
 * gen-build-log.mjs — generiert das Build-Log der Startseite automatisch.
 *
 * Quellen:
 *   1. GIT  — die Commit-Historie des Studio-Repos = datierte Spine (was an welchem Tag passierte).
 *   2. CURATED — web/content/build-log.curated.json: handgeschriebene, lesbare Prosa pro Tag.
 *               Wo ein Tag kuratiert ist, gewinnt die Prosa; sonst wird der Tag plain aus den
 *               Commit-Subjects gerendert (klar als „auto“ markiert).
 *   3. NOTION (publish-gated) — nur Kanban-Zeilen mit Checkbox „Auf Website“ = true werden
 *               übernommen. Ohne Token oder ohne markierte Zeilen passiert NICHTS (kein Leak
 *               interner Notizen). Token via Env NOTION_TOKEN.
 *
 * Output: web/lib/build-log.generated.json  (newest first)
 *
 * Aufruf:  node scripts/gen-build-log.mjs        (aus web/)
 *          NOTION_TOKEN=ntn_... node scripts/gen-build-log.mjs   (mit Notion-Layer)
 *
 * Läuft NICHT im Browser und NICHT im Docker-Build — auf dem Host (lokal oder per Cron),
 * Ergebnis wird als statisches JSON committet. Keine Secrets im Bundle.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(__dirname, "..");
const REPO_ROOT = join(WEB_ROOT, ".."); // ai-adoption-studio/
const CURATED_PATH = join(WEB_ROOT, "content", "build-log.curated.json");
const OUT_PATH = join(WEB_ROOT, "lib", "build-log.generated.json");

const BOOTCAMP_START = new Date("2026-05-06T00:00:00");

const NOTION_DB = "d7c02dd2-4661-4132-9451-8261ade04c94";
const NOTION_PUBLISH_PROP = "Auf Website"; // Checkbox in Notion, die einen Eintrag freigibt
const STATUS_MAP = { Erledigt: "live", "In Arbeit": "building", Offen: "planned" };

function dayNumber(iso) {
  const d = new Date(iso + "T00:00:00");
  return Math.max(1, Math.floor((d - BOOTCAMP_START) / 86400000) + 1);
}
function ddmmyyyy(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** Commits aus dem Repo, gruppiert nach Kalendertag (Autor-Datum). */
function gitDays() {
  const raw = execSync(
    `git -C "${REPO_ROOT}" log --no-merges --date=short --pretty=format:"%ad%x09%s"`,
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
  ).trim();
  const byDay = new Map();
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    const tab = line.indexOf("\t");
    const date = line.slice(0, tab); // YYYY-MM-DD
    const subject = line.slice(tab + 1).trim();
    if (!byDay.has(date)) byDay.set(date, []);
    byDay.get(date).push(subject);
  }
  return byDay;
}

/** Notion-Zeilen mit Publish-Flag = true. Leeres Array, wenn kein Token / keine Markierung. */
async function notionPublished() {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    console.log("· Notion: kein NOTION_TOKEN gesetzt → Notion-Layer übersprungen (nur Git).");
    return [];
  }
  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: NOTION_PUBLISH_PROP, checkbox: { equals: true } },
        page_size: 100,
      }),
    });
    const data = await res.json();
    if (!data.results) {
      // Property existiert evtl. noch nicht → sicher abbrechen, nichts veröffentlichen.
      console.log(`· Notion: Filter „${NOTION_PUBLISH_PROP}“ nicht anwendbar (${data.message || "kein results"}) → nichts übernommen.`);
      return [];
    }
    const txt = (p) =>
      p?.type === "title" ? p.title.map((x) => x.plain_text).join("")
      : p?.type === "rich_text" ? p.rich_text.map((x) => x.plain_text).join("")
      : "";
    const out = data.results.map((r) => {
      const p = r.properties;
      const dateProp = p["Website-Datum"]?.date?.start; // optional: eigenes Anzeige-Datum
      const iso = (dateProp || r.created_time).slice(0, 10);
      return {
        iso,
        title: txt(p["Aufgabe"]) || "Ohne Titel",
        body: txt(p["Notiz"]),
        status: STATUS_MAP[p["Status"]?.select?.name] || "building",
        source: "notion",
      };
    });
    console.log(`· Notion: ${out.length} freigegebene Zeile(n) übernommen.`);
    return out;
  } catch (e) {
    console.log("· Notion: Abruf fehlgeschlagen → übersprungen.", e.message);
    return [];
  }
}

async function main() {
  const curated = JSON.parse(readFileSync(CURATED_PATH, "utf8")).entries || {};
  const git = gitDays();
  const notion = await notionPublished();

  // Alle relevanten Tage: kuratierte ∪ Git-Tage ∪ Notion-Tage
  const days = new Set([...Object.keys(curated), ...git.keys(), ...notion.map((n) => n.iso)]);

  const entries = [];
  for (const iso of days) {
    const notionForDay = notion.filter((n) => n.iso === iso);
    if (curated[iso]) {
      entries.push({
        iso,
        day: `Tag ${dayNumber(iso)}`,
        date: ddmmyyyy(iso),
        title: curated[iso].title,
        body: curated[iso].body,
        status: curated[iso].status || "live",
        source: "curated",
      });
    } else if (git.has(iso)) {
      const subs = git.get(iso);
      entries.push({
        iso,
        day: `Tag ${dayNumber(iso)}`,
        date: ddmmyyyy(iso),
        title: subs[0],
        body: subs.length > 1 ? "Außerdem: " + subs.slice(1).join(" · ") : "",
        status: "live",
        source: "git",
        commits: subs,
      });
    }
    // Notion-Einträge des Tages anhängen (nur explizit freigegebene)
    for (const n of notionForDay) {
      entries.push({
        iso,
        day: `Tag ${dayNumber(iso)}`,
        date: ddmmyyyy(iso),
        title: n.title,
        body: n.body,
        status: n.status,
        source: "notion",
      });
    }
  }

  // Newest first
  entries.sort((a, b) => (a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0));

  const payload = {
    updatedAt: new Date().toISOString(),
    generatedFrom: { git: true, curated: true, notion: notion.length > 0 },
    entries,
  };
  writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n");
  console.log(`✅ ${entries.length} Build-Log-Einträge → lib/build-log.generated.json`);
}

main().catch((e) => {
  console.error("Generator-Fehler:", e);
  process.exit(1);
});
