/**
 * Visningsläge för säljmötet.
 *
 * Sätt NEXT_PUBLIC_VISNINGSLAGE=begransad när du bygger för att få den
 * nedbantade versionen: bara startsidan och produktsidorna går att öppna.
 * Allt annat (kategorier, kassa, logga in, Mitt konto ...) visar ett
 * meddelande om att det byggs i nästa steg, och adresserna skickas till
 * startsidan.
 */
export const LIMITED_DEMO = process.env.NEXT_PUBLIC_VISNINGSLAGE === "begransad";

/** Sidor som går att öppna i den nedbantade versionen. */
export function allowedInLimitedDemo(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/produkt/");
}

export const LIMITED_MESSAGE = "Den här delen byggs i nästa steg";
export const LIMITED_DETAIL = "I den här versionen visar vi startsidan och produktsidorna.";

/** Adresser som skickas till startsidan i den nedbantade versionen. */
export const LIMITED_REDIRECT_SOURCES = [
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
  "/mitt-konto",
  "/mitt-konto/:path*",
  "/kundservice",
];
