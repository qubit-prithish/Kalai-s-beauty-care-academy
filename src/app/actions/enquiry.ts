"use server";

import { createClient } from "@/lib/supabase/server";

export type EnquiryResult = { ok: boolean; error?: string };

/**
 * Persists a Contact enquiry to Supabase (public INSERT, RLS-guarded). Includes
 * server-side validation and a honeypot spam guard. Booking remains WhatsApp-
 * only; this simply records the enquiry for the admin enquiries list (no owner
 * notification, per spec).
 */
export async function submitEnquiry(input: {
  name: string;
  phone: string;
  topic?: string;
  message: string;
  pageSource?: string;
  /** Honeypot — must be empty for a human. */
  company?: string;
}): Promise<EnquiryResult> {
  // Spam guard: bots fill hidden fields.
  if (input.company && input.company.trim() !== "") {
    return { ok: true }; // silently accept-and-drop
  }

  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const message = (input.message ?? "").trim();

  if (name.length < 2) return { ok: false, error: "name" };
  if (phone.replace(/\D/g, "").length < 10) return { ok: false, error: "phone" };
  if (message.length < 5) return { ok: false, error: "message" };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("enquiries").insert({
      name,
      phone,
      course_interest: input.topic ?? "general",
      message,
      page_source: input.pageSource ?? "contact",
    });
    if (error) return { ok: false, error: "server" };
    return { ok: true };
  } catch {
    return { ok: false, error: "server" };
  }
}
