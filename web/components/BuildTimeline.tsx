import { StatusPill } from "./StatusPill";

export type BuildEntry = {
  day: number;
  date: string;
  title: string;
  body: string;
  status: "live" | "building" | "planned";
  tag?: string;
};

export function BuildTimeline({ entries }: { entries: BuildEntry[] }) {
  return (
    <ol className="relative">
      <div className="hidden lg:block absolute left-[120px] top-0 bottom-0 w-px bg-ink/15" aria-hidden />
      {entries.map((e, idx) => (
        <li
          key={`${e.day}-${idx}`}
          className="relative grid grid-cols-12 gap-x-8 py-12 lg:py-16 border-b border-ink/10 last:border-b-0"
        >
          <div className="col-span-12 lg:col-span-2 mb-6 lg:mb-0">
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
              {e.date}
            </p>
            <p className="mt-2 font-display italic text-2xl lg:text-3xl text-burgundy leading-none"
               style={{ fontVariationSettings: '"WONK" 1' }}>
              Tag {e.day}
            </p>
            {e.tag && (
              <p className="mt-3 font-mono text-[9px] tracking-eyebrow uppercase text-ink3">
                · {e.tag}
              </p>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-1 relative">
            <span className="absolute left-[-9px] top-2 inline-block w-[14px] h-[14px] rounded-full bg-paper border-2 border-burgundy" />
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="flex items-start gap-4 mb-3 flex-wrap">
              <StatusPill status={e.status} />
            </div>
            <h3 className="font-display text-3xl lg:text-5xl text-ink leading-[1.02] mb-4 max-w-3xl"
                style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1, "opsz" 144', fontWeight: 500 }}>
              <em>{e.title}</em>
            </h3>
            <p className="text-ink/75 leading-relaxed text-base lg:text-lg max-w-2xl">
              {e.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
