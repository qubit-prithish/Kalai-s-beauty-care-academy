import type { Offer } from "../types";

export const offers: Offer[] = [
  {
    id: "o01",
    title: { en: "Free demo class", ta: "இலவச டெமோ வகுப்பு" },
    description: {
      en: "Try any course free before you enrol. Limited weekly slots.",
      ta: "சேருவதற்கு முன் எந்த பாடத்தையும் இலவசமாக முயற்சிக்கவும். வாராந்திர ஸ்லாட்கள் வரம்புக்குட்பட்டவை.",
    },
    badge: { en: "FREE DEMO", ta: "இலவசம்" },
    active: true,
    expiresAt: null,
  },
  {
    id: "o02",
    title: { en: "Easy EMI on all courses", ta: "அனைத்து பாடங்களுக்கும் எளிய EMI" },
    description: {
      en: "Flexible instalments so fees never stop your dream. Ask us on WhatsApp.",
      ta: "கட்டணம் உங்கள் கனவைத் தடுக்காதபடி நெகிழ்வான தவணைகள். வாட்ஸ்அப்பில் கேளுங்கள்.",
    },
    badge: { en: "EMI", ta: "EMI" },
    active: true,
    expiresAt: null,
  },
  {
    id: "o03",
    title: { en: "Free student starter kit", ta: "இலவச மாணவி ஆரம்ப கிட்" },
    description: {
      en: "Enrol in a diploma or advanced course and receive a professional kit.",
      ta: "டிப்ளமோ அல்லது மேம்பட்ட பாடத்தில் சேர்ந்து தொழில்முறை கிட் பெறுங்கள்.",
    },
    badge: { en: "FREE KIT", ta: "இலவச கிட்" },
    active: true,
    expiresAt: null,
  },
];
