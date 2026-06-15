"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { submitEnquiry } from "@/app/actions/enquiry";

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
  sendAnother: string;
  errName: string;
  errPhone: string;
  errMessage: string;
};

type Errors = Partial<Record<"name" | "phone" | "message", string>>;

export function EnquiryForm({ labels }: { labels: EnquiryFormLabels }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "cooldown">("idle");

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

    const now = Date.now();
    const lastSubStr = localStorage.getItem("lastEnquiryTimestamp");
    if (lastSubStr) {
      const elapsed = now - parseInt(lastSubStr, 10);
      if (elapsed < 60000) {
        setStatus("cooldown");
        return;
      }
    }

    setStatus("sending");

    // Persist via the server action (Supabase INSERT, RLS-guarded). Includes a
    // honeypot ("company") to deter spam bots.
    const res = await submitEnquiry({
      ...payload,
      company: String(fd.get("company") ?? ""),
      pageSource: typeof window !== "undefined" ? window.location.pathname : "contact",
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
      localStorage.setItem("lastEnquiryTimestamp", Date.now().toString());
    } else {
      setStatus("error");
    }
  }

  if (status === "cooldown") {
    return (
      <div role="status" aria-live="polite" aria-atomic="true" className="rounded-3xl border border-rose-500/30 bg-rose-500/[0.08] p-8 text-center">
        <div className="heading-display text-2xl text-rose-300">Please Wait</div>
        <p className="mt-3 text-sm leading-relaxed text-cream-muted">
          You have already submitted an enquiry recently. Please wait a minute before trying again.
        </p>
        <Button
          variant="secondary"
          onClick={() => setStatus("idle")}
          className="mt-4"
        >
          {labels.sendAnother || "Try Again"}
        </Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" aria-atomic="true" className="rounded-3xl border border-gold-500/30 bg-gold-500/[0.08] p-8 text-center">
        <div className="heading-display text-2xl text-gold-200">{labels.successTitle}</div>
        <p className="mt-3 text-sm leading-relaxed text-cream-muted">{labels.successText}</p>
        <Button
          variant="secondary"
          onClick={() => setStatus("idle")}
          className="mt-4"
        >
          {labels.sendAnother}
        </Button>
      </div>
    );
  }

  const field =
    "mt-1.5 w-full rounded-2xl border border-ink-border bg-ink-page px-4 py-3 text-sm text-cream placeholder:text-cream-dim focus-visible:border-gold-400";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from humans, bots tend to fill it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
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
