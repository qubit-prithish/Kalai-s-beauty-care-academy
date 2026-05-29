import { getTranslations } from "next-intl/server";
import { StatCounter } from "@/components/ui/StatCounter";
import type { Settings } from "@/lib/content/types";

/** Parses a string like "1000+" / "42K+" into { value, suffix }. */
function parseStat(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { value: 0, suffix: raw };
  return { value: Number(match[1]), suffix: match[2] };
}

export async function StatsBand({ settings }: { settings: Settings }) {
  const t = await getTranslations("stats");
  const students = parseStat(settings.studentsTrained);
  const followers = parseStat(settings.instagramFollowers);

  return (
    <section className="border-y border-ink-border bg-ink-surface/50">
      <div className="container-luxe grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
        <StatCounter value={students.value} suffix={students.suffix} label={t("students")} />
        <StatCounter value={settings.yearsExperience} suffix="+" label={t("years")} />
        <StatCounter value={settings.googleRating} decimal suffix="★" label={t("rating")} />
        <StatCounter value={followers.value} suffix={followers.suffix} label={t("followers")} />
      </div>
    </section>
  );
}
