/**
 * Barcode & SKU Utilities for Omnichannel POS and Product Inventory Management
 */

// Helper to remove accents and clean text for SKU creation
function cleanCodeText(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}

/**
 * Generate a standard SKU for a product (e.g. DK-ONG-8921)
 */
export function generateSku(categoryNameOrSlug?: string, productName?: string): string {
  const prefix = "DK";
  let catPart = "GEN";

  if (categoryNameOrSlug) {
    const cleaned = cleanCodeText(categoryNameOrSlug);
    catPart = cleaned.slice(0, 3) || "GEN";
  } else if (productName) {
    const cleaned = cleanCodeText(productName);
    catPart = cleaned.slice(0, 3) || "PRO";
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${catPart}-${randomNum}`;
}

/**
 * Calculate EAN-13 Checksum Digit
 */
function calculateEan13Checksum(first12Digits: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(first12Digits[i], 10) || 0;
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

/**
 * Generate a valid 13-digit EAN-13 barcode
 * Prefix 893 is GS1 Vietnam prefix
 */
export function generateEan13Barcode(prefix = "893"): string {
  const randomPart = Math.floor(100000000 + Math.random() * 900000000).toString(); // 9 digits
  const first12 = (prefix + randomPart).slice(0, 12);
  const checksum = calculateEan13Checksum(first12);
  return `${first12}${checksum}`;
}

/**
 * Generate lightweight Code 128 (Subset B) SVG representation
 */
const CODE128_B_PATTERNS: string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

export function encodeCode128B(text: string): string {
  const startCode = 104; // Start B
  const stopCode = 106;
  const chars = text.split("");
  const codes: number[] = [startCode];

  let checkSum = startCode;
  chars.forEach((char, idx) => {
    const ascii = char.charCodeAt(0);
    const val = ascii >= 32 && ascii <= 126 ? ascii - 32 : 0;
    codes.push(val);
    checkSum += val * (idx + 1);
  });

  const checkDigit = checkSum % 103;
  codes.push(checkDigit);
  codes.push(stopCode);

  return codes.map((c) => CODE128_B_PATTERNS[c] || "").join("");
}

/**
 * Render pure SVG Barcode string for high-speed vector display
 */
export function getBarcodeSvgDataUrl(barcodeText: string, height = 44): string {
  if (!barcodeText || !barcodeText.trim()) return "";
  const pattern = encodeCode128B(barcodeText.trim());
  if (!pattern) return "";

  let x = 10;
  const barWidth = 2;
  const bars: string[] = [];

  for (let i = 0; i < pattern.length; i++) {
    const width = parseInt(pattern[i], 10) * barWidth;
    if (i % 2 === 0) {
      // Black bar
      bars.push(`<rect x="${x}" y="4" width="${width}" height="${height}" fill="#000000" />`);
    }
    x += width;
  }

  const totalWidth = x + 10;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height + 22}" viewBox="0 0 ${totalWidth} ${height + 22}">
    <rect width="100%" height="100%" fill="#ffffff" rx="6" />
    ${bars.join("")}
    <text x="${totalWidth / 2}" y="${height + 18}" text-anchor="middle" font-family="monospace, sans-serif" font-size="12" font-weight="bold" fill="#334155">${barcodeText.trim()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
