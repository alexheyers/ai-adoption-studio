"use client";

import { motion } from "framer-motion";
import { WHAT_IS_IT } from "@/lib/what-is-it";

/**
 * WhatIsIt — Section 00.
 *
 * Eingehängt zwischen Hero (Section 01) und Build-Log (Section 02).
 * Beantwortet die Frage „Was liegt eigentlich auf myflowmotion.cloud?"
 * in Doku-Tonality, nicht in Marketing-Sprache.
 *
 * Client Component (seit framer-motion-Integration):
 * - whileInView-Entrances für Section-Number, Headline-Stack, Tiles
 * - Stagger-Container für Tiles + Target-Audience
 * - Mouse-tracked Tilt-Hover über framer (rotateX/rotateY) statt statisches CSS
 * - Slide-in von links für Anti-Kriterien
 *
 * Reste aus dem Server-Component-Setup (.scroll-reveal · .scroll-mask · .scroll-word ·
 * .num-sticky · .tilt-card · .italic-accent · .section-num) bleiben als CSS-Klassen
 * erhalten, werden aber von framer überlagert wo nötig.
 */

const tileContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const tileItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const audienceContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const audienceItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function WhatIsIt() {
  const { eyebrow, brand, tagline, intro, tiles, targetAudience, notForYou, status } = WHAT_IS_IT;

  // Brand-Lock zerlegen, damit „.“ nach „Studio“ als Gold-Akzent rendert.
  const brandWithDot = `${brand}.`;

  return (
    <section
      id="was-ist-das"
      className="brutal-bg-light border-b-2 border-ink scroll-reveal relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
        {/* ─── Kopfzeile · Section-Nummer + Headline ─── */}
        <div className="grid grid-cols-12 gap-x-8 mb-20">
          {/* Linke Spalte · riesige Section-Number, sticky */}
          <div className="col-span-12 lg:col-span-2">
            <div className="num-sticky">
              <p className="eyebrow mb-4">{eyebrow}</p>
              <motion.span
                aria-hidden="true"
                className="section-num leading-none select-none block"
                initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                00
              </motion.span>
            </div>
          </div>

          {/* Rechte Spalte · Headline + Brand-Lock + Intro */}
          <div className="col-span-12 lg:col-span-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              <h2 className="h-brutal-md text-ink">
                <span className="scroll-word inline-block">Worum es hier</span>{" "}
                <span className="scroll-word inline-block">eigentlich</span>{" "}
                <em className="italic-accent text-burgundy scroll-word inline-block">geht</em>.
              </h2>
            </motion.div>

            {/* Brand-Lock · prominentes Display mit Gold-Punkt */}
            <motion.div
              className="mt-14 scroll-mask"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.3 }}
            >
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-4">
                Das hier ist
              </p>
              <p
                className="font-display text-ink leading-[0.92] font-medium"
                style={{
                  fontSize: "clamp(2.8rem, 8vw, 7rem)",
                  letterSpacing: "-0.03em",
                  fontStyle: "italic",
                  fontVariationSettings: '"WONK" 1, "SOFT" 80, "opsz" 144',
                }}
              >
                {brandWithDot.slice(0, -1)}
                <span className="text-gold">.</span>
              </p>
              <motion.p
                className="mt-8 max-w-3xl text-ink/85 leading-snug font-display italic"
                style={{ fontSize: "clamp(1.3rem, 2vw, 1.9rem)" }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, delay: 0.45 }}
              >
                {tagline}
              </motion.p>
            </motion.div>

            {/* Intro-Paragraf · ruhige Doku-Tonality */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.6 }}
            >
              <p className="mt-12 max-w-3xl text-lg lg:text-xl text-ink/75 leading-relaxed">
                {intro}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ─── 3 Tiles · 3D-Tilt-Cards (mouse-tracked via framer) ─── */}
        <motion.div
          className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={tileContainerVariants}
        >
          {tiles.map((tile) => (
            <motion.div
              key={tile.n}
              className="tilt-card scroll-reveal"
              variants={tileItemVariants}
              transition={{ duration: 0.6 }}
              whileHover={{ rotateX: 4, rotateY: -3, scale: 1.02, z: 20 }}
              style={{ transformPerspective: 1200 }}
            >
              <article className="tilt-card-inner h-full bg-paper2 border-l-2 border-burgundy p-8 lg:p-10 flex flex-col">
                <p className="brutal-rank text-burgundy/90 leading-none mb-6">{tile.n}</p>
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mb-4">
                  {tile.eyebrow}
                </p>
                <h3
                  className="font-display text-ink leading-tight mb-5"
                  style={{ fontSize: "clamp(1.4rem, 2vw, 1.85rem)" }}
                >
                  <em className="italic-accent text-burgundy">{tile.headline}</em>
                </h3>
                <p className="text-ink/75 leading-relaxed text-base lg:text-lg">{tile.body}</p>
              </article>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Zielgruppe · 3 kompakte Spalten ─── */}
        <div className="mt-24 grid grid-cols-12 gap-x-8 gap-y-10 scroll-reveal border-t border-ink/15 pt-14">
          <div className="col-span-12 lg:col-span-2">
            <p className="eyebrow">{targetAudience.eyebrow}</p>
          </div>
          <motion.div
            className="col-span-12 lg:col-span-10 grid md:grid-cols-3 gap-x-10 gap-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={audienceContainerVariants}
          >
            {targetAudience.items.map((item) => (
              <motion.div
                key={item.who}
                className="border-l border-burgundy/40 pl-5"
                variants={audienceItemVariants}
                transition={{ duration: 0.55 }}
              >
                <p className="font-display text-ink text-xl lg:text-2xl leading-snug">
                  <em>{item.who}</em>
                </p>
                <p className="mt-3 text-ink/70 leading-relaxed text-sm lg:text-base">{item.note}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ─── Anti-Kriterien · ehrliche Hairline-Sektion ─── */}
        <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-8 scroll-reveal border-t border-ink/15 pt-14">
          <div className="col-span-12 lg:col-span-2">
            <p className="eyebrow">{notForYou.eyebrow}</p>
          </div>
          <div className="col-span-12 lg:col-span-10">
            <ul className="space-y-4 text-ink/80 text-lg leading-relaxed max-w-3xl">
              {notForYou.items.map((line, i) => (
                <motion.li
                  key={line}
                  className="flex gap-4 border-b border-ink/10 pb-4 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <span className="font-mono text-burgundy text-sm pt-1 shrink-0">—</span>
                  <span>{line}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Status-Zeile · klein, font-mono, ehrlich ─── */}
        <div className="mt-16 pt-8 border-t border-ink/15 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
            {status.eyebrow}
          </p>
          <p className="font-mono text-[11px] tracking-eyebrow uppercase text-ink/65">
            {status.note}
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhatIsIt;
