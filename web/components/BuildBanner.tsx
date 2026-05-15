"use client";

import { getCurrentDay, BOOTCAMP_DAYS } from "@/lib/bootcamp";

export function BuildBanner({ lastBuildLabel }: { lastBuildLabel: string }) {
  const day = getCurrentDay();
  return (
    <div className="w-full bg-ink text-paper border-b border-paper/10">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-between gap-4 font-mono text-[10px] tracking-eyebrow uppercase">
        <span className="flex items-center gap-2">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-sage opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sage" />
          </span>
          <span className="text-paper">Live im Bau</span>
          <span className="text-paper/40 hidden sm:inline">·</span>
          <span className="text-paper hidden sm:inline">Tag {day} von {BOOTCAMP_DAYS}</span>
        </span>
        <span className="text-paper/60 hidden md:inline">
          Vibe Coding Bootcamp · 06.05.–30.07.2026
        </span>
        <span className="text-paper/70 truncate">
          Letzter Build: <span className="text-gold">{lastBuildLabel}</span>
        </span>
      </div>
    </div>
  );
}
