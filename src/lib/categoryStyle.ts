import type { CategorySlug } from "@/data/catalog";

/** Varje kategori har en egen färg som används i menyn och på startsidan. */
export const categoryStyle: Record<CategorySlug, { dot: string; bg: string; text: string; soft: string; image: string; tagline: string }> = {
  dryck: {
    dot: "bg-teal",
    bg: "bg-teal",
    text: "text-white",
    soft: "bg-teal-light",
    image: "/assets/bilder/kat-dryck.jpg",
    tagline: "Läsk, energidryck och iste",
  },
  "snacks-och-kex": {
    dot: "bg-sun",
    bg: "bg-sun",
    text: "text-ink",
    soft: "bg-sun-light",
    image: "/assets/bilder/kat-snacks.jpg",
    tagline: "Saltín Noel, Ducales och chips",
  },
  "saser-och-kryddor": {
    dot: "bg-tangerine",
    bg: "bg-tangerine",
    text: "text-white",
    soft: "bg-tangerine-light",
    image: "/assets/bilder/kat-saser.jpg",
    tagline: "Sazón, adobo, ají och buljong",
  },
  torrvaror: {
    dot: "bg-leaf",
    bg: "bg-leaf",
    text: "text-white",
    soft: "bg-leaf-light",
    image: "/assets/bilder/kat-torrvaror.jpg",
    tagline: "Bönor, masarepa och konserver",
  },
  godis: {
    dot: "bg-brand",
    bg: "bg-brand",
    text: "text-white",
    soft: "bg-rose-light",
    image: "/assets/bilder/kat-godis.jpg",
    tagline: "Klubbor, choklad och kola",
  },
};
