import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { COMPANY_DATA } from "@/data/company";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title =
      searchParams.get("title") ||
      COMPANY_DATA.fullName ||
      "Vật Tư Điện Lạnh Chính Hãng";
    const desc =
      searchParams.get("desc") ||
      "Tổng Kho Sỉ & Lẻ Vật Tư, Linh Kiện Điện Lạnh Hàng Đầu";
    const price = searchParams.get("price");
    const brand = searchParams.get("brand") || COMPANY_DATA.shortName || "VẬT TƯ ĐÔNG KHA";
    const city = searchParams.get("city") || COMPANY_DATA.city || "Đà Nẵng";
    const hotline = searchParams.get("hotline") || COMPANY_DATA.hotline || "0905 487 441";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#081524",
            backgroundImage:
              "radial-gradient(circle at 90% 10%, rgba(7, 95, 168, 0.35) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(244, 122, 32, 0.25) 0%, transparent 50%)",
            padding: "60px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Top Brand Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "2px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "16px",
                  padding: "10px 20px",
                }}
              >
                <span
                  style={{
                    color: "#38BDF8",
                    fontSize: "20px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {brand}
                </span>
              </div>
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Kho Hàng {city}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                padding: "8px 18px",
                borderRadius: "999px",
                color: "#6EE7B7",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              100% Chính Hãng CO/CQ
            </div>
          </div>

          {/* Center Content: Title & Price Tag */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 40 ? "46px" : "56px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
                display: "-webkit-box",
                overflow: "hidden",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: "22px",
                color: "#CBD5E1",
                lineHeight: 1.4,
              }}
            >
              {desc}
            </div>

            {price && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#F47A20",
                    color: "#FFFFFF",
                    fontSize: "28px",
                    fontWeight: 900,
                    padding: "8px 24px",
                    borderRadius: "14px",
                    boxShadow: "0 10px 25px -5px rgba(244, 122, 32, 0.4)",
                  }}
                >
                  {price}
                </div>
                <span
                  style={{
                    color: "#38BDF8",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  Sẵn kho số lượng lớn • Giao nhanh 2h
                </span>
              </div>
            )}
          </div>

          {/* Bottom Bar: Hotline & Website */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#FBBF24",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              Hotline / Zalo: {hotline}
            </div>

            <div
              style={{
                color: "#94A3B8",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              https://vattudongkha.io.vn
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
