// WhatsApp-only booking helpers. Single source for the number + prefilled
// context messages. Booking is WhatsApp-only (no online payment).

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP ?? "919566229900";
export const PHONE_PRIMARY_E164 = "+919566229900";

export function whatsappHref(message: string, number: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function telHref(e164: string = PHONE_PRIMARY_E164) {
  return `tel:${e164.replace(/\s+/g, "")}`;
}

export const waMessage = {
  general: () =>
    "Hi Kalai's Beauty Academy, I'd like to know more about your courses and services.",
  course: (name: string) =>
    `Hi Kalai's Beauty Academy, I'm interested in the ${name} course. Could you share fees, batch dates and EMI options?`,
  service: (name: string) =>
    `Hi Kalai's Beauty Academy, I'd like to book a ${name} appointment. Please share availability and price.`,
  freeDemo: () =>
    "Hi Kalai's Beauty Academy, I'd like to book a free demo class. Please share the next available slot.",
  contact: () =>
    "Hi Kalai's Beauty Academy, I just visited your website and would like to get in touch.",
};
