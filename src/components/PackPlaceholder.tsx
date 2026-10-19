import type { PackShape } from "@/data/catalog";

/**
 * Neutral platshållare som ritar en förpackning (burk, flaska, kartong ...)
 * i lugna gråbeige toner med märkesnamnet på etiketten.
 */
const BODY = "#e4ddd3";
const SHADE = "#d8cfc3";
const DARK = "#cbc1b4";
const LIGHT = "#ede8e1";
const TEXT = "#8a7d70";

function Label({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  const upper = text.toUpperCase();
  const size = Math.min(10.5, (w * 0.86) / (upper.length * 0.68));
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      fontWeight={700}
      letterSpacing={size * 0.08}
      fill={TEXT}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {upper}
    </text>
  );
}

export function PackPlaceholder({
  shape,
  label,
  className = "",
  tight = false,
}: {
  shape: PackShape;
  label?: string;
  className?: string;
  /** Mindre luft runt förpackningen, för kluster av illustrationer */
  tight?: boolean;
}) {
  const text = label ?? "";
  return (
    <svg viewBox={tight ? "38 18 124 156" : "20 12 160 160"} className={className} role="img" aria-label={label ? `${label}, bild saknas` : "Bild saknas"}>
      <ellipse cx="100" cy="166" rx="46" ry="6" fill="#000" opacity="0.05" />
      {shape === "can" && (
        <g>
          <rect x="70" y="40" width="60" height="124" rx="10" fill={BODY} />
          <rect x="74" y="34" width="52" height="10" rx="5" fill={DARK} />
          <rect x="70" y="80" width="60" height="48" fill={SHADE} />
          <rect x="79" y="46" width="6" height="112" rx="3" fill="#fff" opacity="0.35" />
          <Label x={100} y={104} w={60} text={text} />
        </g>
      )}
      {shape === "tin" && (
        <g>
          <rect x="62" y="68" width="76" height="94" rx="8" fill={BODY} />
          <rect x="59" y="62" width="82" height="9" rx="4.5" fill={DARK} />
          <rect x="59" y="156" width="82" height="9" rx="4.5" fill={DARK} />
          <rect x="62" y="88" width="76" height="50" fill={SHADE} />
          <rect x="70" y="74" width="6" height="80" rx="3" fill="#fff" opacity="0.35" />
          <Label x={100} y={113} w={76} text={text} />
        </g>
      )}
      {shape === "bottle" && (
        <g>
          <rect x="88" y="22" width="24" height="11" rx="3" fill={DARK} />
          <rect x="90" y="31" width="20" height="26" rx="3" fill={BODY} />
          <path d="M90 56 C90 67 72 70 72 88 L72 156 Q72 164 80 164 L120 164 Q128 164 128 156 L128 88 C128 70 110 67 110 56 Z" fill={BODY} />
          <rect x="72" y="100" width="56" height="38" fill={SHADE} />
          <rect x="80" y="88" width="5" height="66" rx="2.5" fill="#fff" opacity="0.35" />
          <Label x={100} y={119} w={56} text={text} />
        </g>
      )}
      {shape === "box" && (
        <g>
          <polygon points="64,42 78,34 142,34 128,42" fill={LIGHT} />
          <polygon points="128,42 142,34 142,154 128,162" fill={DARK} />
          <rect x="64" y="42" width="64" height="120" rx="2" fill={BODY} />
          <rect x="64" y="86" width="64" height="40" fill={SHADE} />
          <Label x={96} y={106} w={64} text={text} />
        </g>
      )}
      {shape === "sachet" && (
        <g>
          <polygon points="54,74 68,66 150,66 136,74" fill={LIGHT} />
          <polygon points="136,74 150,66 150,154 136,162" fill={DARK} />
          <rect x="54" y="74" width="82" height="88" rx="2" fill={BODY} />
          <rect x="54" y="100" width="82" height="36" fill={SHADE} />
          <Label x={95} y={118} w={82} text={text} />
        </g>
      )}
      {shape === "jar" && (
        <g>
          <rect x="72" y="48" width="56" height="18" rx="4" fill={DARK} />
          <rect x="66" y="64" width="68" height="98" rx="14" fill={BODY} />
          <rect x="66" y="94" width="68" height="42" fill={SHADE} />
          <rect x="75" y="72" width="6" height="82" rx="3" fill="#fff" opacity="0.35" />
          <Label x={100} y={115} w={68} text={text} />
        </g>
      )}
      {shape === "bag" && (
        <g>
          <path d="M62 44 L138 44 L134 58 Q142 102 134 148 L138 162 L62 162 L66 148 Q58 102 66 58 Z" fill={BODY} />
          <path d="M62 44 L138 44 L136 52 L64 52 Z" fill={DARK} />
          <path d="M64 154 L136 154 L138 162 L62 162 Z" fill={DARK} />
          <rect x="66" y="88" width="68" height="40" rx="4" fill={SHADE} />
          <Label x={100} y={108} w={68} text={text} />
        </g>
      )}
      {shape === "bar" && (
        <g>
          <path d="M52 70 L148 64 L150 100 L54 106 Z" fill={LIGHT} />
          <path d="M44 92 L156 92 L152 100 L156 108 L152 116 L156 124 L44 124 L48 116 L44 108 L48 100 Z" fill={BODY} />
          <rect x="72" y="92" width="56" height="32" fill={SHADE} />
          <Label x={100} y={108} w={56} text={text} />
        </g>
      )}
    </svg>
  );
}
