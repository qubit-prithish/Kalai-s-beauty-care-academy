import type { GalleryItem } from "../types";

// Photos are PENDING — empty src renders an elegant placeholder tile.
export const gallery: GalleryItem[] = [
  { id: "g01", type: "image", src: "", caption: { en: "Bridal makeup look", ta: "மணப்பெண் மேக்கப்" }, category: "work" },
  { id: "g02", type: "image", src: "", caption: { en: "Student practical session", ta: "மாணவி பயிற்சி" }, category: "team" },
  { id: "g03", type: "image", src: "", caption: { en: "Nail art design", ta: "நெயில் ஆர்ட்" }, category: "work" },
  { id: "g04", type: "image", src: "", caption: { en: "Academy interior", ta: "கல்விக்கூட உட்புறம்" }, category: "interior" },
  { id: "g05", type: "image", src: "", caption: { en: "Mehendi design", ta: "மருதாணி வடிவம்" }, category: "work" },
  { id: "g06", type: "image", src: "", caption: { en: "Certificate day", ta: "சான்றிதழ் நாள்" }, category: "event" },
];
