// Kopierar mappen assets till public/assets och skriver en lista över
// vilka bilder som finns (src/data/asset-manifest.json). Körs automatiskt
// före "npm run dev" och "npm run build". Starta om dev-servern om du
// lägger till nya bilder medan den är igång.
//
// Namngivning:
//   assets/logo.(svg|png|webp|jpg)        logga på ljus bakgrund
//   assets/logo-ljus.(svg|png|webp|jpg)   logga på mörk bakgrund (valfri)
//   assets/hero.(jpg|webp|png)            stor bild på startsidan (valfri)
//   assets/products/<artikelnummer>.jpg   produktbild, t.ex. 30105.jpg
//   assets/products/<slug>.jpg            fungerar också
//   assets/brands/<märke>.(svg|png)       märkeslogga, t.ex. goya.png

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, basename, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "assets");
const dest = join(root, "public", "assets");
const manifestPath = join(root, "src", "data", "asset-manifest.json");
const imageExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif", ".gif"]);

const manifest = { logo: null, logoLight: null, hero: null, products: {}, brands: {} };

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });

if (existsSync(src)) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });

  for (const file of walk(src)) {
    const ext = extname(file).toLowerCase();
    if (!imageExt.has(ext)) continue;
    const rel = relative(src, file).split(sep);
    const url = "/assets/" + rel.map(encodeURIComponent).join("/");
    const key = basename(file, extname(file)).toLowerCase();

    if (rel.length === 1) {
      if (key === "logo") manifest.logo = url;
      else if (key === "logo-ljus" || key === "logo-light") manifest.logoLight = url;
      else if (key === "hero") manifest.hero = url;
    } else if (rel[0] === "products") {
      manifest.products[key] = url;
    } else if (rel[0] === "brands") {
      manifest.brands[key] = url;
    }
  }
}

mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

const count = Object.keys(manifest.products).length;
console.log(
  `[assets] logga: ${manifest.logo ? "ja" : "nej"}, stor bild: ${manifest.hero ? "ja" : "nej"}, produktbilder: ${count}, märkesloggor: ${Object.keys(manifest.brands).length}`,
);
