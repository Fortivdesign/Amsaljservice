import type { PackShape } from "@/data/catalog";

/**
 * Ritad förpackning (burk, flaska, kartong ...) i märkets färger med
 * märkesnamnet på etiketten. Används när det saknas produktbild.
 */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(hex: string, target: number, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const m = (c: number) => Math.round(c + (target - c) * amount);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function Label({ x, y, w, text, color }: { x: number; y: number; w: number; text: string; color: string }) {
  const upper = text.toUpperCase();
  const size = Math.min(12, (w * 0.86) / (upper.length * 0.62));
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      fontWeight={400}
      letterSpacing={size * 0.04}
      fill={color}
      style={{ fontFamily: "var(--font-poster)" }}
    >
      {upper}
    </text>
  );
}

export function PackPlaceholder({
  shape,
  label,
  color = "#d9d2c7",
  accent = "#ffffff",
  className = "",
  tight = false,
}: {
  shape: PackShape;
  label?: string;
  color?: string;
  accent?: string;
  className?: string;
  /** Mindre luft runt förpackningen */
  tight?: boolean;
}) {
  const text = label ?? "";
  const body = color;
  const dark = mix(color, 0, 0.28);
  const light = mix(color, 255, 0.35);
  const band = accent;
  // Text på etiketten: märkets färg om etiketten är ljus, annars vit
  const textColor = luminance(accent) > 0.45 ? (luminance(color) < 0.6 ? color : "#1c1230") : "#ffffff";
  const rim = "#c9ccd3";
  const shine = luminance(color) > 0.7 ? 0.5 : 0.22;

  return (
    <svg viewBox={tight ? "38 18 124 156" : "20 12 160 160"} className={className} role="img" aria-label={label ? `${label}, illustration` : "Illustration"}>
      <ellipse cx="100" cy="166" rx="46" ry="6" fill="#1c1230" opacity="0.08" />
      {shape === "can" && (
        <g>
          <rect x="70" y="40" width="60" height="124" rx="10" fill={body} />
          <rect x="74" y="34" width="52" height="10" rx="5" fill={rim} />
          <rect x="70" y="80" width="60" height="48" fill={band} />
          <rect x="70" y="128" width="60" height="5" fill={dark} opacity="0.5" />
          <rect x="79" y="46" width="6" height="112" rx="3" fill="#fff" opacity={shine} />
          <Label x={100} y={104} w={60} text={text} color={textColor} />
        </g>
      )}
      {shape === "tin" && (
        <g>
          <rect x="62" y="68" width="76" height="94" rx="8" fill={body} />
          <rect x="59" y="62" width="82" height="9" rx="4.5" fill={rim} />
          <rect x="59" y="156" width="82" height="9" rx="4.5" fill={rim} />
          <rect x="62" y="88" width="76" height="50" fill={band} />
          <rect x="70" y="74" width="6" height="80" rx="3" fill="#fff" opacity={shine} />
          <Label x={100} y={113} w={76} text={text} color={textColor} />
        </g>
      )}
      {shape === "bottle" && (
        <g>
          <rect x="88" y="22" width="24" height="11" rx="3" fill={dark} />
          <rect x="90" y="31" width="20" height="26" rx="3" fill={body} />
          <path d="M90 56 C90 67 72 70 72 88 L72 156 Q72 164 80 164 L120 164 Q128 164 128 156 L128 88 C128 70 110 67 110 56 Z" fill={body} />
          <rect x="72" y="100" width="56" height="38" fill={band} />
          <rect x="80" y="88" width="5" height="66" rx="2.5" fill="#fff" opacity={shine} />
          <Label x={100} y={119} w={56} text={text} color={textColor} />
        </g>
      )}
      {shape === "box" && (
        <g>
          <polygon points="64,42 78,34 142,34 128,42" fill={light} />
          <polygon points="128,42 142,34 142,154 128,162" fill={dark} />
          <rect x="64" y="42" width="64" height="120" rx="2" fill={body} />
          <rect x="64" y="86" width="64" height="40" fill={band} />
          <Label x={96} y={106} w={64} text={text} color={textColor} />
        </g>
      )}
      {shape === "sachet" && (
        <g>
          <polygon points="54,74 68,66 150,66 136,74" fill={light} />
          <polygon points="136,74 150,66 150,154 136,162" fill={dark} />
          <rect x="54" y="74" width="82" height="88" rx="2" fill={body} />
          <rect x="54" y="100" width="82" height="36" fill={band} />
          <Label x={95} y={118} w={82} text={text} color={textColor} />
        </g>
      )}
      {shape === "jar" && (
        <g>
          <rect x="72" y="48" width="56" height="18" rx="4" fill={dark} />
          <rect x="66" y="64" width="68" height="98" rx="14" fill={body} />
          <rect x="66" y="94" width="68" height="42" fill={band} />
          <rect x="75" y="72" width="6" height="82" rx="3" fill="#fff" opacity={shine} />
          <Label x={100} y={115} w={68} text={text} color={textColor} />
        </g>
      )}
      {shape === "bag" && (
        <g>
          <path d="M62 44 L138 44 L134 58 Q142 102 134 148 L138 162 L62 162 L66 148 Q58 102 66 58 Z" fill={body} />
          <path d="M62 44 L138 44 L136 52 L64 52 Z" fill={dark} />
          <path d="M64 154 L136 154 L138 162 L62 162 Z" fill={dark} />
          <rect x="66" y="88" width="68" height="40" rx="4" fill={band} />
          <Label x={100} y={108} w={68} text={text} color={textColor} />
        </g>
      )}
      {shape === "bar" && (
        <g>
          <path d="M52 70 L148 64 L150 100 L54 106 Z" fill={light} />
          <path d="M44 92 L156 92 L152 100 L156 108 L152 116 L156 124 L44 124 L48 116 L44 108 L48 100 Z" fill={body} />
          <rect x="72" y="92" width="56" height="32" fill={band} />
          <Label x={100} y={108} w={56} text={text} color={textColor} />
        </g>
      )}
    </svg>
  );
}
