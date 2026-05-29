import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  /** Heading level for the title. Use h1 once per page (page title). */
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag className="heading-display mt-3 text-3xl leading-tight sm:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-cream-muted">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}
