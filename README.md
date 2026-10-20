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

## Startsidan

Startsidan är byggd för att sälja: färgstarka block, kampanjer med nedräkning och tydliga knappar till "Bli kund". Uppifrån och ner:

1. Mörk rad med de tre löftena (snabb leverans, fri frakt, faktura) och betyget. Raden sitter fast högst upp och syns alltid, även när man scrollar.
2. Rosa kampanjrad med nedräkning till söndag kväll.
3. Stor bild med rubrik, knappar, nedräkning till dagens sista ordertid ("Beställ inom 2 tim 10 min, leverans onsdag") och veckans deal.
4. Rullande rad med märkena, kategorikort med foto, veckans kampanj, bästsäljare med flikar per kategori, två bildbanners, "Så blir du kund", nyheter, omdömen, fyra fördelar och en avslutande uppmaning.

Priser syns bara för inloggade. Utloggade ser "Logga in för att se pris" och hur mycket de sparar på kampanjvaror.

### Popups och knuffar

- **Rabattruta:** efter 12 sekunder, eller när muspekaren lämnar fönstret uppåt, visas "Spara 10 % på första ordern". Den visas en gång per besök och aldrig på bli kund, logga in eller i kassan. Inloggade får i stället veckans deal.
- **Sökknuff:** söker man på något som har en kampanj (till exempel "goya" eller "arizona") dyker en ruta upp med rabatten. Ger två sökningar inga träffar visas en ruta med telefonnummer till kundservice.
- **Varukorgen:** knappen uppe till höger visar "Till kassan" och summan, med en tunn mätare mot fri frakt. När man lägger i en produkt fälls en ruta ut med produkten och hur mycket som är kvar till fri frakt. Rutan försvinner efter 5 sekunder (`cartPopupSeconds` i `src/config/shop.ts`), och toppraden byter "Fri frakt över 3 000 kr" mot till exempel "1 328 kr kvar till fri frakt".
- **Mobil:** utloggade har en fast list längst ner med "Logga in" och "Bli kund, spara 10 %".

För att visa rabattrutan direkt i ett möte: öppna http://localhost:3000/?popup=visa. `?popup=av` stänger av den i webbläsaren och `?popup=pa` slår på den igen.

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
| `brandColor` | Huvudfärgen (rosa) på knappar och kampanjer |
| `orderCutoff` | Sista ordertid för dagen i nedräkningen "Beställ inom ..." |
| `campaign` | Veckans kampanj: namn, text och vilken veckodag den slutar |
| `welcomeOffer` | Rabatten i popupen, rabattkoden och efter hur många sekunder den visas |
| `socialProof` | Betyg, antal omdömen, antal butiker och kundcitaten. Exempeltext, byt mot riktiga siffror innan sajten går live |
| `contact` | Telefon, e-post och adress i sidfoten |

Produkterna finns i `src/data/catalog.ts` (33 produkter i 5 kategorier) och demokunden med ordrar, fakturor och inköpslistor i `src/data/account.ts`.

## Logga och produktbilder

Alla 33 produkter har riktiga produktbilder i `assets/products`, döpta efter artikelnumret. De är hämtade från tillverkarnas och butikernas sajter (bland annat goya.com, dulces.se och colombianska Éxito) och friställda så att de ligger likadant på den ljusa bakgrunden. Källorna står i `assets/products/KALLOR.md`. Bilderna är till för att visa prototypen och ska bytas mot leverantörernas bilder innan sajten går live.

Vill du byta en bild: lägg den nya i `assets/products` med samma filnamn och starta om `npm run dev`. Se `assets/README.md` för hur filerna ska heta. Saknas en produktbild visas en platshållare som ritar förpackningen i märkets färger.

Miljöbilderna på startsidan ligger i `assets/bilder` och kommer från Pexels (fria att använda). Källorna står i `assets/bilder/KALLOR.md`.

## Nedbantad version för kunden

Det finns en version där bara startsidan och produktsidorna går att öppna. Klickar man på något annat (kategorier, logga in, varukorg, kassa och så vidare) visas "Den här delen byggs i nästa steg", och skriver man in en annan adress hamnar man på startsidan. Popupen, kampanjerna och sökförslagen finns kvar.

Live: https://amsaljservice-forslag.vercel.app

Bygg den själv genom att sätta en miljövariabel:

```bash
NEXT_PUBLIC_VISNINGSLAGE=begransad npm run build
npm start
```

Vilka sidor som är öppna styrs i `src/lib/demoMode.ts`.

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

Bilderna: 01 startsida utloggad, 02 kategori utloggad, 03 bli kund, 04 kontot granskas, 05 logga in, 06 startsida inloggad, 07 kategori med priser, 08 produktsida, 09 varukorg med fraktmätare, 10 kassa leverans, 11 kassa frakt, 12 kassa betalning, 13 orderbekräftelse, 14 mitt konto, 15 orderhistorik med beställ igen, 16 fakturor, 17 snabbbeställning, 18 rabattpopup, 19 sökknuff med kampanj, 20 rutan som visas när man lagt i en produkt.

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

Next.js 16 (App Router) med Tailwind CSS 4, TypeScript och ikoner från Lucide. Typsnitten Anton (rubriker), Outfit och DM Sans följer med som npm-paket, så inget hämtas från internet när sidan visas.

Live, hela versionen: https://amsaljservice.vercel.app
