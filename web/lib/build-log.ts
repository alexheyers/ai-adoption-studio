import data from "./build-log.generated.json";

export type BuildStatus = "live" | "building" | "planned";

export type BuildEntry = {
  iso: string;
  day: string;
  date: string;
  title: string;
  body: string;
  status: BuildStatus;
  source: "curated" | "git" | "notion";
  commits?: string[];
};

/**
 * Automatisch generiert aus Git + Curated (+ optional Notion) via scripts/gen-build-log.mjs.
 * Newest first. NICHT von Hand editieren — Inhalte in content/build-log.curated.json pflegen.
 */
export const BUILD_LOG: BuildEntry[] = data.entries as BuildEntry[];
export const BUILD_LOG_UPDATED: string = data.updatedAt;
