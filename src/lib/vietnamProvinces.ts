export interface ProvinceItem {
  code: string | number;
  name: string;
  englishName?: string;
  administrativeLevel?: string;
  decree?: string;
}

export interface WardUnitItem {
  code: string | number;
  name: string;
  administrativeLevel?: string;
  districtName?: string;
  label: string;
  decree?: string;
}

// 34 Provinces / Centrally-governed Cities of Vietnam (Hậu sáp nhập - Theo Cas AddressKit & NQ 202/2025/QH15)
export const VIETNAM_PROVINCES: ProvinceItem[] = [
  { code: "48", name: "Thành phố Đà Nẵng", administrativeLevel: "Thành phố Trung ương" },
  { code: "01", name: "Thành phố Hà Nội", administrativeLevel: "Thành phố Trung ương" },
  { code: "79", name: "Thành phố Hồ Chí Minh", administrativeLevel: "Thành phố Trung ương" },
  { code: "31", name: "Thành phố Hải Phòng", administrativeLevel: "Thành phố Trung ương" },
  { code: "46", name: "Thành phố Huế", administrativeLevel: "Thành phố Trung ương" },
  { code: "92", name: "Thành phố Cần Thơ", administrativeLevel: "Thành phố Trung ương" },
  { code: "04", name: "Tỉnh Cao Bằng", administrativeLevel: "Tỉnh" },
  { code: "08", name: "Tỉnh Tuyên Quang", administrativeLevel: "Tỉnh" },
  { code: "11", name: "Tỉnh Điện Biên", administrativeLevel: "Tỉnh" },
  { code: "12", name: "Tỉnh Lai Châu", administrativeLevel: "Tỉnh" },
  { code: "14", name: "Tỉnh Sơn La", administrativeLevel: "Tỉnh" },
  { code: "15", name: "Tỉnh Lào Cai", administrativeLevel: "Tỉnh" },
  { code: "19", name: "Tỉnh Thái Nguyên", administrativeLevel: "Tỉnh" },
  { code: "20", name: "Tỉnh Lạng Sơn", administrativeLevel: "Tỉnh" },
  { code: "22", name: "Tỉnh Quảng Ninh", administrativeLevel: "Tỉnh" },
  { code: "24", name: "Tỉnh Bắc Ninh", administrativeLevel: "Tỉnh" },
  { code: "25", name: "Tỉnh Phú Thọ", administrativeLevel: "Tỉnh" },
  { code: "33", name: "Tỉnh Hưng Yên", administrativeLevel: "Tỉnh" },
  { code: "37", name: "Tỉnh Ninh Bình", administrativeLevel: "Tỉnh" },
  { code: "38", name: "Tỉnh Thanh Hóa", administrativeLevel: "Tỉnh" },
  { code: "40", name: "Tỉnh Nghệ An", administrativeLevel: "Tỉnh" },
  { code: "42", name: "Tỉnh Hà Tĩnh", administrativeLevel: "Tỉnh" },
  { code: "44", name: "Tỉnh Quảng Trị", administrativeLevel: "Tỉnh" },
  { code: "51", name: "Tỉnh Quảng Ngãi", administrativeLevel: "Tỉnh" },
  { code: "52", name: "Tỉnh Gia Lai", administrativeLevel: "Tỉnh" },
  { code: "56", name: "Tỉnh Khánh Hòa", administrativeLevel: "Tỉnh" },
  { code: "66", name: "Tỉnh Đắk Lắk", administrativeLevel: "Tỉnh" },
  { code: "68", name: "Tỉnh Lâm Đồng", administrativeLevel: "Tỉnh" },
  { code: "75", name: "Tỉnh Đồng Nai", administrativeLevel: "Tỉnh" },
  { code: "80", name: "Tỉnh Tây Ninh", administrativeLevel: "Tỉnh" },
  { code: "82", name: "Tỉnh Đồng Tháp", administrativeLevel: "Tỉnh" },
  { code: "86", name: "Tỉnh Vĩnh Long", administrativeLevel: "Tỉnh" },
  { code: "91", name: "Tỉnh An Giang", administrativeLevel: "Tỉnh" },
  { code: "96", name: "Tỉnh Cà Mau", administrativeLevel: "Tỉnh" },
];

const ADDRESS_KIT_API_BASE = "https://production.cas.so/address-kit/latest";

let cachedProvinces: ProvinceItem[] | null = null;
const wardCache: Record<string, WardUnitItem[]> = {};

// Normalize code to 2-digit format for Cas AddressKit (e.g. 1 -> "01", 48 -> "48")
function normalizeProvinceCode(code: string | number): string {
  const s = String(code).trim();
  if (s.length === 1) return `0${s}`;
  return s;
}

// Fetch all 34 provinces / cities
export async function fetchProvinces(): Promise<ProvinceItem[]> {
  if (cachedProvinces && cachedProvinces.length > 0) {
    return cachedProvinces;
  }

  try {
    const res = await fetch(`${ADDRESS_KIT_API_BASE}/provinces`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.provinces) && data.provinces.length > 0) {
        cachedProvinces = data.provinces.map((p: any) => ({
          code: String(p.code),
          name: p.name,
          englishName: p.englishName,
          administrativeLevel: p.administrativeLevel,
          decree: p.decree,
        }));
        return cachedProvinces!;
      }
    }
  } catch (err) {
    console.warn("Cas AddressKit provinces fetch failed, falling back to local list:", err);
  }

  cachedProvinces = VIETNAM_PROVINCES;
  return cachedProvinces;
}

// Fetch all Communes / Wards / Sub-units (2-tier administrative level) of a Province
export async function fetchWardsByProvince(provinceCode: number | string): Promise<WardUnitItem[]> {
  const normCode = normalizeProvinceCode(provinceCode);

  if (wardCache[normCode] && wardCache[normCode].length > 0) {
    return wardCache[normCode];
  }

  try {
    const res = await fetch(`${ADDRESS_KIT_API_BASE}/provinces/${normCode}/communes`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.communes)) {
        const units: WardUnitItem[] = data.communes.map((c: any) => ({
          code: String(c.code),
          name: c.name,
          administrativeLevel: c.administrativeLevel,
          label: c.name,
          decree: c.decree,
        }));

        if (units.length > 0) {
          wardCache[normCode] = units;
          return units;
        }
      }
    }
  } catch (err) {
    console.warn(`Cas AddressKit communes fetch failed for province ${normCode}:`, err);
  }

  return wardCache[normCode] || [];
}

