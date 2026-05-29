"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export type EnquiryFormLabels = {
  name: string;
  phone: string;
  topic: string;
  topicGeneral: string;
  topicCourse: string;
  topicService: string;
  message: string;
  submit: string;
  sending: string;
  successTitle: string;
  successText: string;
  errName: string;
  errPhone: string;
  errMessage: string;
};

type Errors = Partial<Record<"name" | "phone" | "message", string>>;

export function EnquiryForm({ labels }: { labels: EnquiryFormLabels }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  function validate(data: { name: string; phone: string; message: string }): Errors {
    const e: Errors = {};
    if (data.name.trim().length < 2) e.name = labels.errName;
    // Indian-friendly: 10+ digits after stripping non-digits.
    if (data.phone.replace(/\D/g, "").length < 10) e.phone = labels.errPhone;
    if (data.message.trim().length < 5) e.message = labels.errMessage;
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      topic: String(fd.get("topic") ?? "general"),
      message: String(fd.get("message") ?? ""),
    };

    const e = validate(payload);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("sending");

    // TODO(backend): POST `payload` to the enquiries endpoint / Supabase here.
    // For now this is UI-only and does NOT persist. Simulate a brief delay so
    // the success state is visible; the backend track will replace this block.
    await new Promise((r) => setTimeout(r, 600));

    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-gold-500/30 bg-gold-500/[0.08] p-8 text-center">
        <div className="heading-display text-2xl text-gold-200">{labels.successTitle}</div>
        <p className="mt-3 text-sm leading-relaxed text-cream-muted">{labels.successText}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm text-gold-300 underline underline-offset-4"
        >
          ↺
        </button>
      </div>
    );
  }

  const field =
    "mt-1.5 w-full rounded-2xl border border-ink-border bg-ink-page px-4 py-3 text-sm text-cream placeholder:text-cream-dim focus-visible:border-gold-400";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-cream">
          {labels.name}
        </label>
        <input id="name" name="name" type="text" autoComplete="name" className={field} aria-invalid={!!errors.name} />
        {errors.name ? <p className="mt-1 text-xs text-rose-300">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-medium text-cream">
          {labels.phone}
        </label>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field} aria-invalid={!!errors.phone} />
        {errors.phone ? <p className="mt-1 text-xs text-rose-300">{errors.phone}</p> : null}
      </div>

      <div>
        <label htmlFor="topic" className="text-sm font-medium text-cream">
          {labels.topic}
        </label>
        <select id="topic" name="topic" className={field} defaultValue="general">
          <option value="general">{labels.topicGeneral}</option>
          <option value="course">{labels.topicCourse}</option>
          <option value="service">{labels.topicService}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-cream">
          {labels.message}
        </label>
        <textarea id="message" name="message" rows={4} className={field} aria-invalid={!!errors.message} />
        {errors.message ? <p className="mt-1 text-xs text-rose-300">{errors.message}</p> : null}
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? labels.sending : labels.submit}
      </Button>
    </form>
  );
}
