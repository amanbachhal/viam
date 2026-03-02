/**
 * Normalize hex (#fff → #ffffff)
 */
function normalizeHex(hex: string) {
  if (!hex) return "#000000";

  let clean = hex.replace("#", "").trim();

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return `#${clean}`;
}

/**
 * Convert HEX → RGB
 */
export function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex).replace("#", "");

  return {
    r: parseInt(normalized.substring(0, 2), 16),
    g: parseInt(normalized.substring(2, 4), 16),
    b: parseInt(normalized.substring(4, 6), 16),
  };
}

/**
 * Get relative luminance (WCAG)
 */
function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);

  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Get readable text color (#000 or #fff)
 */
export function getContrastColor(hex?: string) {
  if (!hex) return "#ffffff";

  const luminance = getLuminance(hex);
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Tailwind text class helper
 */
export function getContrastTextClass(hex?: string) {
  return getContrastColor(hex) === "#000000" ? "text-black" : "text-white";
}

/**
 * Soft overlay for badges / glass UI
 */
export function getReadableOverlay(hex?: string) {
  if (!hex) return "rgba(0,0,0,0.4)";

  return getContrastColor(hex) === "#000000"
    ? "rgba(255,255,255,0.6)"
    : "rgba(0,0,0,0.4)";
}

/**
 * Get style object for bg + readable text
 * (super useful for buttons)
 */
export function getBgWithContrast(hex?: string) {
  if (!hex) return {};

  return {
    backgroundColor: hex,
    color: getContrastColor(hex),
  };
}
