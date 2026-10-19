/**
 * Visningslägen för säljmötet. Styrs med miljövariabeln
 * NEXT_PUBLIC_VISNINGSLAGE när sajten byggs:
 *
 *   prototyp   (standard på den här grenen) Startsidan, en enda produkt
 *              (den första i Fiesta-veckan) och Mitt konto går att öppna.
 *              Allt annat visar "Den här delen byggs i nästa steg".
 *   begransad  Startsidan och alla produktsidor går att öppna.
 *   hela       Hela prototypen utan spärrar.
 */
export type DemoMode = "hela" | "begransad" | "prototyp";

const fromEnv = process.env.NEXT_PUBLIC_VISNINGSLAGE;
export const DEMO_MODE: DemoMode = fromEnv === "hela" || fromEnv === "begransad" || fromEnv === "prototyp" ? fromEnv : "prototyp";

/** Någon form av spärr är på. */
export const LIMITED_DEMO = DEMO_MODE !== "hela";
/** Den hårdaste spärren: startsida, en produkt och Mitt konto. */
export const PROTOTYPE_DEMO = DEMO_MODE === "prototyp";

/** Produkten som går att öppna i prototypen: första kortet i Fiesta-veckan (Arizona Mucho Mango). */
export const FEATURED_PRODUCT_SLUG = "arizona-mucho-mango-591-ml";

/** Sidor som går att öppna i det valda läget. */
export function allowedInLimitedDemo(pathname: string): boolean {
  if (pathname === "/") return true;
  if (PROTOTYPE_DEMO) {
    return pathname === `/produkt/${FEATURED_PRODUCT_SLUG}` || pathname === "/mitt-konto" || pathname.startsWith("/mitt-konto/");
  }
  return pathname.startsWith("/produkt/");
}

export const LIMITED_MESSAGE = "Den här delen byggs i nästa steg";
export const LIMITED_DETAIL = PROTOTYPE_DEMO
  ? "I prototypen visar vi startsidan, en produkt och Mitt konto."
  : "I den här versionen visar vi startsidan och produktsidorna.";

const COMMON_REDIRECTS = [
  "/sortiment",
  "/kategori/:path*",
  "/marken",
  "/marke/:path*",
  "/nyheter",
  "/erbjudanden",
  "/sok",
  "/bli-kund",
  "/bli-kund/:path*",
  "/logga-in",
  "/kassa",
  "/kassa/:path*",
  "/kundservice",
];

/** Adresser som skickas till startsidan i det valda läget. */
export const LIMITED_REDIRECT_SOURCES: string[] = !LIMITED_DEMO
  ? []
  : PROTOTYPE_DEMO
    ? [...COMMON_REDIRECTS, `/produkt/:slug((?!${FEATURED_PRODUCT_SLUG}$).*)`]
    : [...COMMON_REDIRECTS, "/mitt-konto", "/mitt-konto/:path*"];
