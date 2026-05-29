import type { Offer } from "../types";

export const offers: Offer[] = [
  {
    id: "o01",
    title: { en: "Free demo class", ta: "இலவச டெமோ வகுப்பு" },
    description: {
      en: "Try any course free before you enrol. Limited weekly slots — message us to reserve yours.",
      ta: "சேருவதற்கு முன் எந்த பாடத்தையும் இலவசமாக முயற்சிக்கவும். வாராந்திர ஸ்லாட்கள் வரம்புக்குட்பட்டவை — உங்களுடையதை முன்பதிவு செய்ய எங்களுக்கு செய்தி அனுப்புங்கள்.",
    },
    badge: { en: "FREE DEMO", ta: "இலவசம்" },
    image: { src: "", alt: { en: "Free demo class", ta: "இலவச டெமோ வகுப்பு" } },
    active: true,
    showPopup: true,
    startsAt: null,
    endsAt: null,
    order: 1,
  },
  {
    id: "o02",
    title: { en: "Easy EMI on all courses", ta: "அனைத்து பாடங்களுக்கும் எளிய EMI" },
    description: {
      en: "Flexible instalments so fees never stop your dream. Ask us on WhatsApp for a plan that fits you.",
      ta: "கட்டணம் உங்கள் கனவைத் தடுக்காதபடி நெகிழ்வான தவணைகள். உங்களுக்கு ஏற்ற திட்டத்திற்கு வாட்ஸ்அப்பில் கேளுங்கள்.",
    },
    badge: { en: "EMI", ta: "EMI" },
    image: { src: "", alt: { en: "Easy EMI", ta: "எளிய EMI" } },
    active: true,
    showPopup: false,
    startsAt: null,
    endsAt: null,
    order: 2,
  },
  {
    id: "o03",
    title: { en: "Free student starter kit", ta: "இலவச மாணவி ஆரம்ப கிட்" },
    description: {
      en: "Enrol in a diploma or advanced course and receive a professional starter kit on us.",
      ta: "டிப்ளமோ அல்லது மேம்பட்ட பாடத்தில் சேர்ந்து தொழில்முறை ஆரம்ப கிட்டை இலவசமாகப் பெறுங்கள்.",
    },
    badge: { en: "FREE KIT", ta: "இலவச கிட்" },
    image: { src: "", alt: { en: "Free starter kit", ta: "இலவச ஆரம்ப கிட்" } },
    active: true,
    showPopup: false,
    startsAt: null,
    endsAt: null,
    order: 3,
  },
];
