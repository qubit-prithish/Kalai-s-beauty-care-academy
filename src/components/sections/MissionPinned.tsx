"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

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
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-mission-step]");
      const goal = el.querySelector("[data-mission-goal]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      gsap.set(steps, { opacity: 0.25 });
      steps.forEach((step, i) => {
        tl.to(step, { opacity: 1, x: 0, duration: 1 }, i * 1.1);
        if (i > 0) tl.to(steps[i - 1], { opacity: 0.25, duration: 1 }, i * 1.1);
      });
      if (goal) {
        tl.fromTo(
          goal,
          { scale: 0.85, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 1.5 },
          0,
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden bg-ink-surface/40 py-section"
    >
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
          <div data-mission-goal className="mt-10">
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
              data-mission-step
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
