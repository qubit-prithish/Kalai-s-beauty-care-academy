// ─────────────────────────────────────────────────────────────────────────────
// Razorpay stub — INTENTIONALLY DISABLED.
//
// Booking is WhatsApp-only. There is NO online payment in this project.
// This stub exists so the integration point is explicit and easy to enable
// later from the backend track if the business ever chooses to. Until then it
// stays off and is not wired to any UI.
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENTS_ENABLED =
  process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true"; // false by default

/** No-op guard. Always returns disabled until the backend track enables it. */
export function getPaymentStatus() {
  return {
    enabled: PAYMENTS_ENABLED, // currently false
    provider: "razorpay" as const,
    note: "Online payment is disabled. Booking is via WhatsApp only.",
  };
}
