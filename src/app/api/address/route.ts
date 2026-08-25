import { NextRequest, NextResponse } from "next/server";

const ADDRESS_KIT_API_BASE = "https://production.cas.so/address-kit/latest";

export async function GET(request: NextRequest) {
  const provinceCode = request.nextUrl.searchParams.get("provinceCode")?.trim();

  if (provinceCode && !/^\d{1,3}$/.test(provinceCode)) {
    return NextResponse.json({ error: "Mã tỉnh/thành phố không hợp lệ." }, { status: 400 });
  }

  const normalizedCode = provinceCode?.padStart(2, "0");
  const endpoint = normalizedCode
    ? `${ADDRESS_KIT_API_BASE}/provinces/${normalizedCode}/communes`
    : `${ADDRESS_KIT_API_BASE}/provinces`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Không thể tải dữ liệu địa chỉ." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    console.error("Address API proxy error:", error);
    return NextResponse.json({ error: "Không thể kết nối dữ liệu địa chỉ." }, { status: 502 });
  }
}