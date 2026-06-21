"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

export type MissionContent = {
  eyebrow: string;
  line1: string;
  line2: string;
  goalNumber: string;
  goalLabel: string;
  steps: { title: string; text: string }[];
};

/**
 * The ONE pinned storytelling moment (Home): the "10,000 by 2030" mission.
 * The section pins while three steps reveal in sequence and the goal number
 * scales up. Under prefers-reduced-motion it renders as a normal static
 * section (no pin, no scrub) and remains fully readable.
 */
export function MissionPinned({ content }: { content: MissionContent }) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  const goalScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const goalOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  const numSteps = content.steps.length;

  if (reduce) {
    return (
      <section className="relative flex min-h-screen items-center overflow-hidden bg-ink-surface/40 py-section">
        <div className="absolute inset-0 -z-10 bg-radial-glow opacity-60" />
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          {/* Goal */}
          <div className="text-center lg:text-left">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 className="heading-display mt-4 text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
              {content.line1}
              <br />
              <span className="text-gold-gradient">{content.line2}</span>
            </h2>
            <div className="mt-10">
              <div className="heading-display text-6xl text-gold-gradient sm:text-7xl lg:text-8xl">
                {content.goalNumber}
              </div>
              <div className="mt-2 text-sm uppercase tracking-luxe text-cream-muted">
                {content.goalLabel}
              </div>
            </div>
          </div>
          {/* Steps */}
          <ol className="space-y-6">
            {content.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-3xl border border-ink-border bg-ink-page/60 p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient font-display text-lg font-bold text-ink-page">
                  {i + 1}
                </span>
                <div>
                  <div className="heading-display text-lg text-gold-200">{step.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-cream-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative bg-ink-surface/40 h-[250vh]">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-radial-glow opacity-60" />
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          {/* Goal */}
          <div className="text-center lg:text-left">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 className="heading-display mt-4 text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
              {content.line1}
              <br />
              <span className="text-gold-gradient">{content.line2}</span>
            </h2>
            <motion.div className="mt-10" style={{ scale: goalScale, opacity: goalOpacity }}>
              <div className="heading-display text-6xl text-gold-gradient sm:text-7xl lg:text-8xl">
                {content.goalNumber}
              </div>
              <div className="mt-2 text-sm uppercase tracking-luxe text-cream-muted">
                {content.goalLabel}
              </div>
            </motion.div>
          </div>

          {/* Steps */}
          <ol className="space-y-6">
            {content.steps.map((step, i) => (
              <StepItem key={i} step={step} index={i} numSteps={numSteps} progress={scrollYProgress} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  step,
  index,
  numSteps,
  progress,
}: {
  step: { title: string; text: string };
  index: number;
  numSteps: number;
  progress: MotionValue<number>;
}) {
  const startIn = index / numSteps;
  const endIn = (index + 0.5) / numSteps;
  const startOut = (index + 1) / numSteps;
  const endOut = (index + 1.5) / numSteps;

  const opacity = useTransform(
    progress,
    [startIn - 0.1, startIn, endIn, startOut, endOut],
    [0.25, 0.25, 1, 1, 0.25]
  );

  return (
    <motion.li
      style={{ opacity }}
      className="flex gap-4 rounded-3xl border border-ink-border bg-ink-page/60 p-6"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient font-display text-lg font-bold text-ink-page">
        {index + 1}
      </span>
      <div>
        <div className="heading-display text-lg text-gold-200">{step.title}</div>
        <p className="mt-1 text-sm leading-relaxed text-cream-muted">{step.text}</p>
      </div>
    </motion.li>
  );
}
