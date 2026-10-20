// Klickar igenom hela köpflödet och sparar numrerade skärmdumpar för
// dator (1440 bred) och mobil (390 bred).
//
//   npm run screenshots
//
// Använder en server som redan är igång på http://localhost:3000
// (npm run dev). Är ingen igång byggs prototypen och startas tillfälligt.
//
// Miljövariabler:
//   BASE_URL=http://localhost:3000   adress till prototypen
//   HELSIDA=0                        hoppa över helsidesbilderna
//   ENHET=dator | mobil              kör bara en av enheterna
//
// Resultat:
//   screenshots/dator/01-startsida-utloggad.png ...   det som syns på skärmen
//   screenshots/mobil/01-startsida-utloggad.png ...
//   screenshots/dator-helsida/... och mobil-helsida/...  hela sidan

import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "screenshots");
let baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const fullPage = process.env.HELSIDA !== "0";
const onlyDevice = process.env.ENHET;

const devices = [
  { name: "dator", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: "mobil", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
].filter((d) => !onlyDevice || d.name === onlyDevice);

const demo = {
  register: {
    company: "Bodega Latina Malmö AB",
    orgnr: "559412-0387",
    contact: "Carlos Rivera",
    email: "carlos@bodegalatina.se",
    phone: "070 555 12 34",
    invoiceEmail: "faktura@bodegalatina.se",
    street: "Bergsgatan 21",
    zip: "214 22",
    city: "Malmö",
    deliveryStreet: "Industrigatan 5",
    deliveryZip: "212 14",
    deliveryCity: "Malmö",
    password: "Bodega2026!",
  },
  login: { email: "maria@tiendasol.se", password: "Demo2026!" },
  reference: "PO 2026-118",
};

// Hjälpfunktioner

async function isUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32", ...opts });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} avslutades med kod ${code}`))));
  });
}

async function startServerIfNeeded() {
  if (await isUp(baseUrl)) {
    console.log(`Använder servern på ${baseUrl}`);
    return null;
  }
  console.log("Ingen server igång. Bygger prototypen och startar den tillfälligt ...");
  await run("npm", ["run", "build"]);
  const port = "3100";
  baseUrl = `http://localhost:${port}`;
  const server = spawn("npx", ["next", "start", "-p", port], { cwd: root, stdio: "ignore", shell: process.platform === "win32" });
  for (let i = 0; i < 60; i++) {
    if (await isUp(baseUrl)) return server;
    await new Promise((r) => setTimeout(r, 500));
  }
  server.kill();
  throw new Error("Servern startade inte");
}

async function settle(page, ms = 500) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

async function waitForToastsToClear(page) {
  const toasts = page.getByTestId("toast");
  const count = await toasts.count();
  for (let i = 0; i < count; i++) {
    await toasts
      .nth(0)
      .getByRole("button", { name: "Stäng" })
      .click({ timeout: 2000 })
      .catch(() => {});
  }
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="toast"]').length === 0, null, { timeout: 6000 }).catch(() => {});
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
}

async function openCategory(page, device, name) {
  if (device.isMobile) {
    await page.getByTestId("menu-button").click();
    await page.getByRole("dialog", { name: "Meny" }).getByRole("link", { name, exact: true }).click();
  } else {
    await page.getByRole("navigation", { name: "Kategorier" }).getByRole("link", { name, exact: true }).click();
  }
  await page.waitForURL(/\/kategori\//);
}

async function accountNav(page, device, name) {
  const nav = page.locator('nav[aria-label="Mitt konto"]:visible');
  await nav.getByRole("link", { name, exact: true }).click();
}

async function runDevice(browser, device) {
  const context = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: device.deviceScaleFactor,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
    locale: "sv-SE",
    timezoneId: "Europe/Stockholm",
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  context.setDefaultTimeout(30000);
  // Popupen och sök-rutan stängs av i huvudflödet så att de inte skymmer bilderna
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("am-popup-off", "1");
    } catch {}
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  const dir = join(outDir, device.name);
  const fullDir = join(outDir, `${device.name}-helsida`);
  mkdirSync(dir, { recursive: true });
  if (fullPage) mkdirSync(fullDir, { recursive: true });

  const shot = async (file, { full = true, scrollTop = true } = {}) => {
    await settle(page);
    if (!device.isMobile) await page.mouse.move(device.viewport.width - 2, device.viewport.height - 2);
    // Varna om sidan blir bredare än skärmen
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) console.warn(`  Varning: ${file} är ${overflow} px bredare än skärmen`);
    if (scrollTop) await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.screenshot({ path: join(dir, `${file}.png`) });
    if (fullPage && full) {
      const y = await page.evaluate(() => window.scrollY);
      await autoScroll(page);
      await page.waitForTimeout(150);
      await page.screenshot({ path: join(fullDir, `${file}.png`), fullPage: true });
      await page.evaluate((top) => window.scrollTo(0, top), y);
    }
    console.log(`  ${device.name}: ${file}`);
  };

  // 01 Startsida utloggad
  await page.goto(`${baseUrl}/?reset`);
  await page.getByTestId("hero-become-customer").waitFor();
  await shot("01-startsida-utloggad");

  // 02 Kategori utloggad
  await openCategory(page, device, "Dryck");
  await page.getByText("Logga in för att se pris").first().waitFor();
  await shot("02-kategori-utloggad");

  // 03 Bli kund
  await page.goto(`${baseUrl}/`);
  await page.getByTestId("hero-become-customer").click();
  await page.waitForURL(/\/bli-kund$/);
  const r = demo.register;
  for (const [field, value] of Object.entries(r)) {
    if (field.startsWith("delivery")) continue;
    if (field === "password") continue;
    await page.locator(`input[name="${field}"]`).fill(value);
  }
  await page.getByText("Leverera till en annan adress").click();
  await page.locator('input[name="deliveryStreet"]').fill(r.deliveryStreet);
  await page.locator('input[name="deliveryZip"]').fill(r.deliveryZip);
  await page.locator('input[name="deliveryCity"]').fill(r.deliveryCity);
  await page.locator('input[name="password"]').fill(r.password);
  await shot("03-bli-kund");

  // 04 Kontot granskas
  await page.getByTestId("register-submit").click();
  await page.waitForURL(/\/bli-kund\/tack/);
  await page.getByTestId("review-steps").waitFor();
  await shot("04-kontot-granskas");

  // 05 Logga in
  await page.getByTestId("account-button").click();
  await page.waitForURL(/\/logga-in/);
  await page.locator("#email").fill(demo.login.email);
  await page.locator("#password").fill(demo.login.password);
  await shot("05-logga-in");

  // 06 Startsida inloggad
  await page.getByTestId("login-submit").click();
  await page.waitForURL((url) => url.pathname === "/");
  await page.getByText("Hej Maria").waitFor();
  await shot("06-startsida-inloggad");

  // 07 Kategori med priser, och lägg några kartonger i varukorgen
  await openCategory(page, device, "Dryck");
  await page.getByRole("button", { name: "Lägg i varukorg" }).first().waitFor();
  await shot("07-kategori-med-priser");

  const closeAdded = async () => {
    const pop = page.getByTestId("added-to-cart");
    if (await pop.isVisible().catch(() => false)) await pop.getByRole("button", { name: "Stäng" }).click().catch(() => {});
    await pop.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
  };
  const addFromList = async (productName, qty) => {
    await closeAdded();
    const card = page.getByTestId("product-card").filter({ has: page.getByRole("link", { name: productName, exact: true }) });
    await card.getByLabel("Antal kartonger").fill(String(qty));
    await card.getByRole("button", { name: "Lägg i varukorg" }).click();
    await page.getByTestId("added-to-cart").waitFor();
  };
  await addFromList("Dr Pepper Original", 4);
  await addFromList("Monster Energy Original", 2);
  await addFromList("Arizona Green Tea med honung", 2);
  // 20 Rutan som visas när man lagt i en produkt, med hur mycket som är kvar till fri frakt
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 900);
  await shot("20-tillagd-i-varukorgen", { full: false });
  await closeAdded();
  await waitForToastsToClear(page);

  // 08 Produktsida, hittad via sökfältet
  const search = page.locator('input[type="search"]:visible').first();
  await search.click();
  await search.fill("kyckling");
  await page.getByRole("link", { name: /CalNort Kycklingbuljong/ }).first().click();
  await page.waitForURL(/\/produkt\//);
  await page.getByTestId("add-to-cart").waitFor();
  await page.getByRole("button", { name: "Öka antal" }).first().click();
  await page.getByRole("button", { name: "Öka antal" }).first().click();
  await shot("08-produktsida");
  await page.getByTestId("add-to-cart").click();
  await page.getByTestId("added-to-cart").waitFor();
  await closeAdded();
  await waitForToastsToClear(page);

  // 09 Varukorg med fraktmätare
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByTestId("cart-button").click();
  await page.getByTestId("free-shipping-meter").waitFor();
  await shot("09-varukorg-med-fraktmatare", { full: false });

  // 10 Kassa: leverans
  await page.getByTestId("checkout-button").click();
  await page.waitForURL(/\/kassa$/);
  await page.getByTestId("to-shipping").waitFor();
  await shot("10-kassa-leverans");

  // 11 Kassa: frakt
  await page.getByTestId("to-shipping").click();
  await page.getByTestId("to-payment").waitFor();
  await page.waitForTimeout(700);
  await shot("11-kassa-frakt", { scrollTop: false });

  // 12 Kassa: betalning
  await page.getByTestId("to-payment").click();
  await page.getByTestId("reference").waitFor();
  await page.getByTestId("reference").fill(demo.reference);
  await page.waitForTimeout(700);
  await page.getByTestId("checkout-step-3").evaluate((el) => el.scrollIntoView({ block: "start" }));
  await shot("12-kassa-betalning", { scrollTop: false });

  // 13 Orderbekräftelse
  await page.getByTestId("place-order").click();
  await page.waitForURL(/\/kassa\/bekraftelse/);
  await page.getByTestId("order-number").waitFor();
  await shot("13-orderbekraftelse");

  // 14 Mitt konto
  await page.getByTestId("account-button").click();
  await page.waitForURL(/\/mitt-konto$/);
  await page.getByText("Senaste ordrar").waitFor();
  await shot("14-mitt-konto");

  // 15 Orderhistorik med beställ igen
  await accountNav(page, device, "Ordrar");
  await page.waitForURL(/\/mitt-konto\/ordrar/);
  await page.getByTestId("reorder").first().waitFor();
  await shot("15-orderhistorik");

  // 16 Fakturor
  await accountNav(page, device, "Fakturor");
  await page.waitForURL(/\/mitt-konto\/fakturor/);
  await page.getByTestId("invoice-table").waitFor();
  await shot("16-fakturor");

  // 17 Snabbbeställning
  await accountNav(page, device, "Snabbbeställning");
  await page.waitForURL(/\/mitt-konto\/snabbbestallning/);
  const rows = page.getByTestId("quick-row");
  const fillRow = async (i, art, qty) => {
    await rows.nth(i).getByTestId("quick-art").fill(art);
    await rows.nth(i).getByLabel("Antal kartonger").fill(String(qty));
  };
  await fillRow(0, "10105", 4);
  await fillRow(1, "40101", 3);
  await fillRow(2, "30101", 2);
  await fillRow(3, "20103", 2);
  await fillRow(4, "50101", 1);
  await page.locator("h1").click();
  await shot("17-snabbbestallning");

  if (errors.length) {
    console.warn(`\n  Fel i sidan (${device.name}):\n  ${errors.join("\n  ")}`);
  }
  await context.close();

  // 18 och 19: popupen och sök-rutan, i ett nytt fönster som ny besökare
  const extra = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: device.deviceScaleFactor,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
    locale: "sv-SE",
    timezoneId: "Europe/Stockholm",
    reducedMotion: "reduce",
  });
  extra.setDefaultTimeout(30000);
  const p2 = await extra.newPage();
  const shot2 = async (file) => {
    await settle(p2, 700);
    await p2.screenshot({ path: join(dir, `${file}.png`) });
    console.log(`  ${device.name}: ${file}`);
  };
  await p2.goto(`${baseUrl}/?popup=visa`);
  await p2.getByTestId("welcome-popup").waitFor();
  await shot2("18-popup-rabatt");
  await p2.keyboard.press("Escape");
  await p2.goto(`${baseUrl}/kategori/dryck`);
  const search2 = p2.locator('input[type="search"]:visible').first();
  await search2.click();
  await search2.fill("goya");
  await p2.getByTestId("search-nudge").waitFor();
  await shot2("19-sok-kampanj");
  await extra.close();
}

const server = await startServerIfNeeded();
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const device of devices) {
    console.log(`\n${device.name} (${device.viewport.width} px bred)`);
    await runDevice(browser, device);
  }
  console.log(`\nKlart. Bilderna ligger i ${outDir}`);
} finally {
  await browser.close();
  server?.kill();
}
