# AM Säljservice, prototyp av B2B-webbshop

Klickbar designskiss av en webbshop för AM Säljservice AB, grossist för latinamerikansk mat och amerikansk dryck till butiker. Allt säljs per kartong. Prototypen är inte kopplad till något riktigt system: produkter, priser, kunder och ordrar är påhittade och inloggning och varukorg sparas bara i webbläsaren.

## Kom igång

Kräver Node.js 20 eller senare.

```bash
npm install
npm run dev
```

Öppna http://localhost:3000.

- **Logga in:** vilken e-post och vilket lösenord som helst fungerar. Du blir inloggad som demokunden Tienda Sol Livs AB.
- **Återställ demot:** klicka på "Återställ demo" längst ner i sidfoten, eller öppna http://localhost:3000/?reset. Då töms varukorgen, du loggas ut och ordrarna återgår till ursprungsläget.

## Ändra inställningar

Allt som kan variera ligger i `src/config/shop.ts`:

| Inställning | Vad den styr |
| --- | --- |
| `deliveryDays` | "Snabb leverans inom X arbetsdagar" i toppraden |
| `freeShippingThreshold` | "Fri frakt över X kr", fraktmätaren och fri standardfrakt i kassan |
| `minBestBeforeMonths` | "Minst X månader kvar på bäst före" |
| `invoiceDays` | Betalningsvillkor för faktura |
| `vatRate` | Moms i kassan (6 % gäller livsmedel 1 april 2026 till 31 december 2027) |
| `shippingOptions` | Fraktalternativen i kassan med pris och leveranstid |
| `brandColor` | Accentfärgen på knappar och detaljer |
| `contact` | Telefon, e-post och adress i sidfoten |

Produkterna finns i `src/data/catalog.ts` (33 produkter i 5 kategorier) och demokunden med ordrar, fakturor och inköpslistor i `src/data/account.ts`.

## Logga och produktbilder

Lägg bilder i mappen `assets` och starta om `npm run dev`. Se `assets/README.md` för hur filerna ska heta. Saknas en produktbild visas en neutral platshållare som ritar förpackningen.

## Skärmdumpar till presentationen

Första gången:

```bash
npx playwright install chromium
```

Sedan, med `npm run dev` igång i ett annat terminalfönster:

```bash
npm run screenshots
```

Skriptet (`scripts/screenshots.mjs`) klickar igenom hela flödet och sparar numrerade bilder:

- `screenshots/dator/` och `screenshots/mobil/`: det som syns på skärmen, 1440 respektive 390 pixlar bred
- `screenshots/dator-helsida/` och `screenshots/mobil-helsida/`: hela sidan uppifrån och ner

Bilderna: 01 startsida utloggad, 02 kategori utloggad, 03 bli kund, 04 kontot granskas, 05 logga in, 06 startsida inloggad, 07 kategori med priser, 08 produktsida, 09 varukorg med fraktmätare, 10 kassa leverans, 11 kassa frakt, 12 kassa betalning, 13 orderbekräftelse, 14 mitt konto, 15 orderhistorik med beställ igen, 16 fakturor, 17 snabbbeställning.

Är ingen server igång bygger skriptet prototypen och startar den tillfälligt. `HELSIDA=0` hoppar över helsidesbilderna och `ENHET=dator` eller `ENHET=mobil` kör bara den ena.

## Sidor

| Adress | Sida |
| --- | --- |
| `/` | Startsida |
| `/sortiment` | Alla produkter med filter och sortering |
| `/kategori/dryck` med flera | Kategorisida |
| `/marken`, `/marke/goya` med flera | Märken och märkessida |
| `/nyheter`, `/erbjudanden` | Nyheter och erbjudanden |
| `/sok?q=goya` | Sökresultat |
| `/produkt/...` | Produktsida |
| `/bli-kund`, `/bli-kund/tack` | Registrering och "kontot granskas" |
| `/logga-in` | Logga in och glömt lösenord |
| `/kassa`, `/kassa/bekraftelse` | Kassa i tre steg och orderbekräftelse |
| `/mitt-konto` | Översikt, ordrar, fakturor, snabbbeställning, inköpslistor, favoriter, företag och adresser |
| `/kundservice` | Leverans, betalning, bäst före och kontakt |

## Teknik

Next.js 16 (App Router) med Tailwind CSS 4, TypeScript och ikoner från Lucide. Typsnitten Outfit och DM Sans är desamma som på amsaljservice.se och följer med som npm-paket, så inget hämtas från internet när sidan visas.
