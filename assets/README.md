# Bilder till prototypen

Lägg bilderna här och starta om `npm run dev` (eller kör `npm run assets`). Filerna kopieras till `public/assets` automatiskt.

| Fil | Används till |
| --- | --- |
| `logo.svg` eller `logo.png` | Loggan i headern, på ljus bakgrund |
| `logo-ljus.svg` eller `logo-ljus.png` | Loggan i den mörka sidfoten |
| `hero.jpg` | Stora bilden på startsidan |
| `products/<artikelnummer>.jpg` | Produktbild, till exempel `products/30105.jpg` |
| `brands/<märke>.png` | Märkeslogga, till exempel `brands/goya.png` |

Produktbilder kan också heta som produktens adress, till exempel `products/calnort-kycklingbuljong-80-g.jpg`. Format: jpg, png, webp eller svg. Bilder med vit bakgrund smälter in i den ljusa bakgrunden som alla produktbilder visas på.

Artikelnummer och märkesnamn finns i `src/data/catalog.ts`.

## Om filerna som ligger här nu

- `logo.png` och `logo-ljus.png` är framtagna ur favicon på amsaljservice.se eftersom originalfilen saknades. Byt gärna mot originalet, helst som SVG.
- `hero.jpg` är ett utsnitt av butiksbilden på amsaljservice.se (bara hyllan, utan person).
- Mapparna `products` och `brands` är tomma, så platshållare visas för alla produkter och märken skrivs ut som text.
