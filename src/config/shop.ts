/**
 * Inställningar för prototypen. Ändra här så slår det igenom på alla sidor.
 * Alla belopp är i kronor exklusive moms.
 */
export const shopConfig = {
  companyName: "AM Säljservice AB",
  shortName: "AM Säljservice",

  /** Toppraden: "Snabb leverans inom X arbetsdagar" */
  deliveryDays: 2,

  /** Toppraden och fraktmätaren: "Fri frakt över X kr" */
  freeShippingThreshold: 3000,

  /** Trygghetsraden: "Minst X månader kvar på bäst före" */
  minBestBeforeMonths: 2,

  /** Betalningsvillkor för faktura */
  invoiceDays: 30,

  /**
   * Moms på livsmedel. Tillfälligt sänkt till 6 % från 1 april 2026 till 31 december 2027.
   * Ändra till 0.12 när den ordinarie satsen gäller igen.
   */
  vatRate: 0.06,

  /** Hur lång tid det tar att plocka och packa en order */
  pickingTime: "1 till 2 arbetsdagar",

  /**
   * Fraktalternativ i kassan. "workdays" används för att räkna fram
   * ett leveransdatum från dagens datum.
   */
  shippingOptions: [
    {
      id: "standard",
      name: "Standardleverans",
      description: "Leverans till butiken med lastbil, lossning vardagar 07.00 till 16.00",
      etaLabel: "Beräknad leverans",
      workdays: 2,
      price: 249,
      freeAboveThreshold: true,
    },
    {
      id: "express",
      name: "Expressleverans",
      description: "Nästa arbetsdag vid order före kl. 12.00",
      etaLabel: "Beräknad leverans",
      workdays: 1,
      price: 495,
      freeAboveThreshold: false,
    },
    {
      id: "pickup",
      name: "Hämta själv på lagret",
      description: "Lagervägen 8 i Haninge, vardagar 08.00 till 16.00",
      etaLabel: "Redo att hämtas",
      workdays: 1,
      price: 0,
      freeAboveThreshold: false,
    },
  ],

  /** Färgen på köpknappar och kampanjer (bougainvillearosa). */
  brandColor: "#E5197E",

  /** Order lagd före denna tid en vardag räknas som dagens order */
  orderCutoff: { hour: 14, minute: 0 },

  /** Kampanjen som syns i den rosa raden och på startsidan */
  campaign: {
    title: "Fiesta-veckan",
    text: "Upp till 13 % rabatt på Arizona, Postobón och Goya",
    /** Kampanjen tar slut söndag 23.59 varje vecka i prototypen */
    endsWeekday: 0,
  },

  /** Erbjudandet i popupen för nya besökare */
  /** Antal sekunder som rutan "Tillagd i varukorgen" visas innan den försvinner. */
  cartPopupSeconds: 5,
  welcomeOffer: {
    percent: 10,
    code: "FIESTA10",
    /** Sekunder på sajten innan popupen visas */
    delaySeconds: 12,
  },

  /**
   * Socialt bevis. EXEMPELTEXT i prototypen, byt mot riktiga siffror
   * och riktiga omdömen innan något publiceras.
   */
  socialProof: {
    rating: 4.8,
    reviewCount: 214,
    storeCount: "350",
    reviews: [
      {
        name: "Lina, Tienda Sol Livs",
        city: "Södertälje",
        text: "Beställer på söndag kväll och har varorna i butiken på tisdag. Kunderna frågar efter Postobón och Saltín Noel varje dag.",
      },
      {
        name: "Ahmed, Kvarterslivs",
        city: "Malmö",
        text: "Äntligen en grossist där jag ser alla priser per kartong och per styck direkt. Snabbbeställningen sparar mig en timme i veckan.",
      },
      {
        name: "Camila, Sabor Latino",
        city: "Göteborg",
        text: "Bästa sortimentet av colombianska varor jag hittat i Sverige. Faktura på 30 dagar gör det lätt att fylla på inför helgen.",
      },
    ],
  },

  /** Kontaktuppgifter i sidfoten (påhittade, byt till riktiga) */
  contact: {
    phone: "08 123 45 67",
    email: "order@amsaljservice.se",
    address: "Lagervägen 8, 136 50 Haninge",
    hours: "Vardagar 08.00 till 16.00",
    orgNr: "559000-0000",
  },
} as const;

export type ShippingOption = (typeof shopConfig.shippingOptions)[number];
