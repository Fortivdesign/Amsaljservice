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

  /** Accentfärg från AM Säljservice nuvarande profil (terrakotta). */
  brandColor: "#BF4E29",

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
