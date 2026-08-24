export interface ProvinceItem {
  code: number | string;
  name: string;
}

export interface WardUnitItem {
  code: number | string;
  name: string;
  districtName?: string;
  label: string; // e.g. "Phường Hòa Xuân (Q. Cẩm Lệ)" or "Đặc khu Phú Quốc"
}

// 63 Provinces of Vietnam
export const VIETNAM_PROVINCES: ProvinceItem[] = [
  { code: 48, name: "Thành phố Đà Nẵng" },
  { code: 49, name: "Tỉnh Quảng Nam" },
  { code: 46, name: "Tỉnh Thừa Thiên Huế" },
  { code: 1, name: "Thành phố Hà Nội" },
  { code: 79, name: "Thành phố Hồ Chí Minh" },
  { code: 31, name: "Thành phố Hải Phòng" },
  { code: 92, name: "Thành phố Cần Thơ" },
  { code: 74, name: "Tỉnh Bình Dương" },
  { code: 75, name: "Tỉnh Đồng Nai" },
  { code: 77, name: "Tỉnh Bà Rịa - Vũng Tàu" },
  { code: 51, name: "Tỉnh Quảng Ngãi" },
  { code: 52, name: "Tỉnh Bình Định" },
  { code: 56, name: "Tỉnh Khánh Hòa" },
  { code: 54, name: "Tỉnh Phú Yên" },
  { code: 45, name: "Tỉnh Quảng Trị" },
  { code: 44, name: "Tỉnh Quảng Bình" },
  { code: 42, name: "Tỉnh Hà Tĩnh" },
  { code: 40, name: "Tỉnh Nghệ An" },
  { code: 38, name: "Tỉnh Thanh Hóa" },
  { code: 35, name: "Tỉnh Ninh Bình" },
  { code: 36, name: "Tỉnh Nam Định" },
  { code: 34, name: "Tỉnh Thái Bình" },
  { code: 33, name: "Tỉnh Hưng Yên" },
  { code: 30, name: "Tỉnh Hải Dương" },
  { code: 27, name: "Tỉnh Bắc Ninh" },
  { code: 24, name: "Tỉnh Bắc Giang" },
  { code: 25, name: "Tỉnh Phú Thọ" },
  { code: 26, name: "Tỉnh Vĩnh Phúc" },
  { code: 19, name: "Tỉnh Thái Nguyên" },
  { code: 20, name: "Tỉnh Lạng Sơn" },
  { code: 22, name: "Tỉnh Quảng Ninh" },
  { code: 17, name: "Tỉnh Hòa Bình" },
  { code: 15, name: "Tỉnh Yên Bái" },
  { code: 14, name: "Tỉnh Sơn La" },
  { code: 11, name: "Tỉnh Điện Biên" },
  { code: 12, name: "Tỉnh Lai Châu" },
  { code: 10, name: "Tỉnh Lào Cai" },
  { code: 8, name: "Tỉnh Tuyên Quang" },
  { code: 4, name: "Tỉnh Cao Bằng" },
  { code: 2, name: "Tỉnh Hà Giang" },
  { code: 6, name: "Tỉnh Bắc Kạn" },
  { code: 60, name: "Tỉnh Kon Tum" },
  { code: 62, name: "Tỉnh Gia Lai" },
  { code: 64, name: "Tỉnh Đắk Lắk" },
  { code: 66, name: "Tỉnh Đắk Nông" },
  { code: 68, name: "Tỉnh Lâm Đồng" },
  { code: 58, name: "Tỉnh Ninh Thuận" },
  { code: 60, name: "Tỉnh Bình Thuận" },
  { code: 70, name: "Tỉnh Bình Phước" },
  { code: 72, name: "Tỉnh Tây Ninh" },
  { code: 80, name: "Tỉnh Long An" },
  { code: 82, name: "Tỉnh Tiền Giang" },
  { code: 83, name: "Tỉnh Bến Tre" },
  { code: 84, name: "Tỉnh Trà Vinh" },
  { code: 86, name: "Tỉnh Vĩnh Long" },
  { code: 87, name: "Tỉnh Đồng Tháp" },
  { code: 89, name: "Tỉnh An Giang" },
  { code: 91, name: "Tỉnh Kiên Giang (kèm Đặc khu Phú Quốc)" },
  { code: 93, name: "Tỉnh Hậu Giang" },
  { code: 94, name: "Tỉnh Sóc Trăng" },
  { code: 95, name: "Tỉnh Bạc Liêu" },
  { code: 96, name: "Tỉnh Cà Mau" },
];

// Fallback Wards for key focus provinces
const FALLBACK_WARDS: Record<string, WardUnitItem[]> = {
  // Đà Nẵng
  "48": [
    { code: "20314", name: "Phường Hoà Xuân", districtName: "Cẩm Lệ", label: "Phường Hoà Xuân (Cẩm Lệ)" },
    { code: "20305", name: "Phường Khuê Trung", districtName: "Cẩm Lệ", label: "Phường Khuê Trung (Cẩm Lệ)" },
    { code: "20306", name: "Phường Hoà Phát", districtName: "Cẩm Lệ", label: "Phường Hoà Phát (Cẩm Lệ)" },
    { code: "20308", name: "Phường Hoà An", districtName: "Cẩm Lệ", label: "Phường Hoà An (Cẩm Lệ)" },
    { code: "20311", name: "Phường Hoà Thọ Tây", districtName: "Cẩm Lệ", label: "Phường Hoà Thọ Tây (Cẩm Lệ)" },
    { code: "20312", name: "Phường Hoà Thọ Đông", districtName: "Cẩm Lệ", label: "Phường Hoà Thọ Đông (Cẩm Lệ)" },
    { code: "20194", name: "Phường Hải Châu I", districtName: "Hải Châu", label: "Phường Hải Châu I (Hải Châu)" },
    { code: "20197", name: "Phường Hải Châu II", districtName: "Hải Châu", label: "Phường Hải Châu II (Hải Châu)" },
    { code: "20200", name: "Phường Thạch Thang", districtName: "Hải Châu", label: "Phường Thạch Thang (Hải Châu)" },
    { code: "20203", name: "Phường Thanh Bình", districtName: "Hải Châu", label: "Phường Thanh Bình (Hải Châu)" },
    { code: "20206", name: "Phường Thuận Phước", districtName: "Hải Châu", label: "Phường Thuận Phước (Hải Châu)" },
    { code: "20209", name: "Phường Hòa Thuận Tây", districtName: "Hải Châu", label: "Phường Hòa Thuận Tây (Hải Châu)" },
    { code: "20211", name: "Phường Hòa Thuận Đông", districtName: "Hải Châu", label: "Phường Hòa Thuận Đông (Hải Châu)" },
    { code: "20212", name: "Phường Nam Dương", districtName: "Hải Châu", label: "Phường Nam Dương (Hải Châu)" },
    { code: "20215", name: "Phường Phước Ninh", districtName: "Hải Châu", label: "Phường Phước Ninh (Hải Châu)" },
    { code: "20218", name: "Phường Bình Thuận", districtName: "Hải Châu", label: "Phường Bình Thuận (Hải Châu)" },
    { code: "20221", name: "Phường Bình Hiên", districtName: "Hải Châu", label: "Phường Bình Hiên (Hải Châu)" },
    { code: "20224", name: "Phường Hòa Cường Bắc", districtName: "Hải Châu", label: "Phường Hòa Cường Bắc (Hải Châu)" },
    { code: "20225", name: "Phường Hòa Cường Nam", districtName: "Hải Châu", label: "Phường Hòa Cường Nam (Hải Châu)" },
    { code: "20227", name: "Phường Tam Thuận", districtName: "Thanh Khê", label: "Phường Tam Thuận (Thanh Khê)" },
    { code: "20230", name: "Phường Thanh Khê Tây", districtName: "Thanh Khê", label: "Phường Thanh Khê Tây (Thanh Khê)" },
    { code: "20233", name: "Phường Thanh Khê Đông", districtName: "Thanh Khê", label: "Phường Thanh Khê Đông (Thanh Khê)" },
    { code: "20236", name: "Phường Xuân Hà", districtName: "Thanh Khê", label: "Phường Xuân Hà (Thanh Khê)" },
    { code: "20239", name: "Phường Tân Chính", districtName: "Thanh Khê", label: "Phường Tân Chính (Thanh Khê)" },
    { code: "20242", name: "Phường Chính Gián", districtName: "Thanh Khê", label: "Phường Chính Gián (Thanh Khê)" },
    { code: "20245", name: "Phường Vĩnh Trung", districtName: "Thanh Khê", label: "Phường Vĩnh Trung (Thanh Khê)" },
    { code: "20248", name: "Phường Thạc Gián", districtName: "Thanh Khê", label: "Phường Thạc Gián (Thanh Khê)" },
    { code: "20251", name: "Phường An Khê", districtName: "Thanh Khê", label: "Phường An Khê (Thanh Khê)" },
    { code: "20254", name: "Phường Hòa Khê", districtName: "Thanh Khê", label: "Phường Hòa Khê (Thanh Khê)" },
    { code: "20257", name: "Phường Thọ Quang", districtName: "Sơn Trà", label: "Phường Thọ Quang (Sơn Trà)" },
    { code: "20260", name: "Phường Nại Hiên Đông", districtName: "Sơn Trà", label: "Phường Nại Hiên Đông (Sơn Trà)" },
    { code: "20263", name: "Phường Mân Thái", districtName: "Sơn Trà", label: "Phường Mân Thái (Sơn Trà)" },
    { code: "20266", name: "Phường An Hải Bắc", districtName: "Sơn Trà", label: "Phường An Hải Bắc (Sơn Trà)" },
    { code: "20269", name: "Phường Phước Mỹ", districtName: "Sơn Trà", label: "Phường Phước Mỹ (Sơn Trà)" },
    { code: "20272", name: "Phường An Hải Tây", districtName: "Sơn Trà", label: "Phường An Hải Tây (Sơn Trà)" },
    { code: "20275", name: "Phường An Hải Đông", districtName: "Sơn Trà", label: "Phường An Hải Đông (Sơn Trà)" },
    { code: "20278", name: "Phường Mỹ An", districtName: "Ngũ Hành Sơn", label: "Phường Mỹ An (Ngũ Hành Sơn)" },
    { code: "20281", name: "Phường Khuê Mỹ", districtName: "Ngũ Hành Sơn", label: "Phường Khuê Mỹ (Ngũ Hành Sơn)" },
    { code: "20284", name: "Phường Hoà Quý", districtName: "Ngũ Hành Sơn", label: "Phường Hoà Quý (Ngũ Hành Sơn)" },
    { code: "20287", name: "Phường Hoà Hải", districtName: "Ngũ Hành Sơn", label: "Phường Hoà Hải (Ngũ Hành Sơn)" },
    { code: "20290", name: "Phường Hoà Hiệp Bắc", districtName: "Liên Chiểu", label: "Phường Hoà Hiệp Bắc (Liên Chiểu)" },
    { code: "20293", name: "Phường Hoà Hiệp Nam", districtName: "Liên Chiểu", label: "Phường Hoà Hiệp Nam (Liên Chiểu)" },
    { code: "20296", name: "Phường Hoà Khánh Bắc", districtName: "Liên Chiểu", label: "Phường Hoà Khánh Bắc (Liên Chiểu)" },
    { code: "20299", name: "Phường Hoà Khánh Nam", districtName: "Liên Chiểu", label: "Phường Hoà Khánh Nam (Liên Chiểu)" },
    { code: "20302", name: "Phường Hoà Minh", districtName: "Liên Chiểu", label: "Phường Hoà Minh (Liên Chiểu)" },
    { code: "20317", name: "Xã Hoà Bắc", districtName: "Hòa Vang", label: "Xã Hoà Bắc (Hòa Vang)" },
    { code: "20320", name: "Xã Hoà Liên", districtName: "Hòa Vang", label: "Xã Hoà Liên (Hòa Vang)" },
    { code: "20323", name: "Xã Hoà Ninh", districtName: "Hòa Vang", label: "Xã Hoà Ninh (Hòa Vang)" },
    { code: "20326", name: "Xã Hoà Sơn", districtName: "Hòa Vang", label: "Xã Hoà Sơn (Hòa Vang)" },
    { code: "20329", name: "Xã Hoà Nhơn", districtName: "Hòa Vang", label: "Xã Hoà Nhơn (Hòa Vang)" },
    { code: "20332", name: "Xã Hoà Phú", districtName: "Hòa Vang", label: "Xã Hoà Phú (Hòa Vang)" },
    { code: "20335", name: "Xã Hoà Phong", districtName: "Hòa Vang", label: "Xã Hoà Phong (Hòa Vang)" },
    { code: "20338", name: "Xã Hoà Châu", districtName: "Hòa Vang", label: "Xã Hoà Châu (Hòa Vang)" },
    { code: "20341", name: "Xã Hoà Tiến", districtName: "Hòa Vang", label: "Xã Hoà Tiến (Hòa Vang)" },
    { code: "20344", name: "Xã Hoà Phước", districtName: "Hòa Vang", label: "Xã Hoà Phước (Hòa Vang)" },
    { code: "20347", name: "Xã Hoà Khương", districtName: "Hòa Vang", label: "Xã Hoà Khương (Hòa Vang)" },
  ],
  // Quảng Nam
  "49": [
    { code: "qn-1", name: "Phường An Mỹ", districtName: "TP. Tam Kỳ", label: "Phường An Mỹ (TP. Tam Kỳ)" },
    { code: "qn-2", name: "Phường Tân Thạnh", districtName: "TP. Tam Kỳ", label: "Phường Tân Thạnh (TP. Tam Kỳ)" },
    { code: "qn-3", name: "Phường Minh An", districtName: "TP. Hội An", label: "Phường Minh An (TP. Hội An)" },
    { code: "qn-4", name: "Phường Cẩm Châu", districtName: "TP. Hội An", label: "Phường Cẩm Châu (TP. Hội An)" },
    { code: "qn-5", name: "Phường Điện Ngọc", districtName: "TX. Điện Bàn", label: "Phường Điện Ngọc (TX. Điện Bàn)" },
    { code: "qn-6", name: "Phường Điện Nam Trung", districtName: "TX. Điện Bàn", label: "Phường Điện Nam Trung (TX. Điện Bàn)" },
    { code: "qn-7", name: "Thị trấn Vĩnh Điện", districtName: "TX. Điện Bàn", label: "Thị trấn Vĩnh Điện (TX. Điện Bàn)" },
    { code: "qn-8", name: "Thị trấn Núi Thành", districtName: "H. Núi Thành", label: "Thị trấn Núi Thành (H. Núi Thành)" },
    { code: "qn-9", name: "Thị trấn Hà Lam", districtName: "H. Thăng Bình", label: "Thị trấn Hà Lam (H. Thăng Bình)" },
    { code: "qn-10", name: "Thị trấn Nam Phước", districtName: "H. Duy Xuyên", label: "Thị trấn Nam Phước (H. Duy Xuyên)" },
    { code: "qn-11", name: "Thị trấn Ái Nghĩa", districtName: "H. Đại Lộc", label: "Thị trấn Ái Nghĩa (H. Đại Lộc)" },
  ],
  // Kiên Giang / Đặc khu Phú Quốc
  "91": [
    { code: "kg-1", name: "Phường Dương Đông", districtName: "TP. Phú Quốc", label: "Phường Dương Đông (Đặc khu Phú Quốc)" },
    { code: "kg-2", name: "Phường An Thới", districtName: "TP. Phú Quốc", label: "Phường An Thới (Đặc khu Phú Quốc)" },
    { code: "kg-3", name: "Xã Cửa Cạn", districtName: "TP. Phú Quốc", label: "Xã Cửa Cạn (Đặc khu Phú Quốc)" },
    { code: "kg-4", name: "Xã Gành Dầu", districtName: "TP. Phú Quốc", label: "Xã Gành Dầu (Đặc khu Phú Quốc)" },
    { code: "kg-5", name: "Phường Vĩnh Thanh Vân", districtName: "TP. Rạch Giá", label: "Phường Vĩnh Thanh Vân (TP. Rạch Giá)" },
  ],
};

const wardCache: Record<string, WardUnitItem[]> = {};

// Fetch provinces
export async function fetchProvinces(): Promise<ProvinceItem[]> {
  return VIETNAM_PROVINCES;
}

// Fetch all Wards / Sub-units of a Province in 2-tier format
export async function fetchWardsByProvince(provinceCode: number | string): Promise<WardUnitItem[]> {
  const pCodeStr = String(provinceCode);
  if (wardCache[pCodeStr] && wardCache[pCodeStr].length > 0) {
    return wardCache[pCodeStr];
  }

  if (FALLBACK_WARDS[pCodeStr]) {
    wardCache[pCodeStr] = FALLBACK_WARDS[pCodeStr];
    return FALLBACK_WARDS[pCodeStr];
  }

  try {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.districts)) {
        const units: WardUnitItem[] = [];
        for (const dist of data.districts) {
          const dName = dist.name.replace(/^(Quận|Huyện|Thành phố|Thị xã)\s+/, "");
          if (Array.isArray(dist.wards)) {
            for (const w of dist.wards) {
              units.push({
                code: w.code,
                name: w.name,
                districtName: dist.name,
                label: `${w.name} (${dName})`,
              });
            }
          }
        }
        if (units.length > 0) {
          wardCache[pCodeStr] = units;
          return units;
        }
      }
    }
  } catch {
    // ignore
  }

  return FALLBACK_WARDS[pCodeStr] || [];
}
