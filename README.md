# Website Thương Mại & Quản Lý Vật Tư Điện Lạnh Đông Kha

> Nền tảng Web Thương Mại & Giới Thiệu Sản Phẩm hiện đại, tối ưu hóa tốc độ tải trang cao (SSG / ISR), chuẩn SEO Google/Bing, tích hợp Cổng Quản Trị Admin, Quản lý Đơn Hàng và In Phiếu Giao Hàng Chuyên Nghiệp.

---

## 🏗️ 1. Công Nghệ Cốt Lõi (Tech Stack)

* **Framework Fullstack**: [Next.js 15 (App Router)](https://nextjs.org/) + React 19 + TypeScript
* **Database & ORM**: PostgreSQL ([Supabase](https://supabase.com/)) + [Prisma ORM 6](https://www.prisma.io/)
* **Styling & UI**: Tailwind CSS 4 + Lucide React Icons
* **Xác thực & Phân quyền**: JWT HttpOnly Cookies + Google Identity Services (GIS OAuth 2.0)
* **Lưu trữ Hình ảnh**: [@vercel/blob](https://vercel.com/docs/storage/vercel-blob)
* **Xuất & In ấn**: jsPDF + html2canvas + ExcelJS (In phiếu đơn hàng & Báo cáo Excel)

---

## ⚡ 2. Điểm Nổi Bật Về Hiệu Năng & SEO

1. **Static Site Generation (SSG & ISR)**:
   - Tự động biên dịch sẵn **57+ trang HTML tĩnh** tại build time qua `generateStaticParams()`.
   - Dữ liệu được cache trong RAM qua `unstable_cache` với thời gian sống 3600s, phục vụ trong **10–25ms**.
   - Tự động làm mới bộ nhớ đệm theo thời gian thực (On-demand Revalidation) mỗi khi Admin thêm/sửa sản phẩm.
2. **Tối ưu Client Bundle (Code Splitting)**:
   - Lazy load (`next/dynamic` với `ssr: false`) các module nặng: Modal tính công suất BTU, Trình in phiếu hóa đơn `PrintableOrderSlip`.
3. **Chuẩn SEO 100% Google & Bing**:
   - Tự động sinh `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, và Apple Touch Icon / Favicon 96x96px.
   - Schema JSON-LD cấu trúc dữ liệu (`Product`, `BreadcrumbList`, `HVACBusiness`, `LocalBusiness`).

---

## 📁 3. Cấu Trúc Dự Án (Directory Structure)

```text
QC/
├── docs/                             # Tài liệu kỹ thuật chi tiết & Kiến trúc hệ thống
│   ├── SYSTEM_ARCHITECTURE.md        # Tài liệu Kiến trúc Hệ thống (Đầy đủ)
│   └── DOMAIN_SEO_GUIDE.md           # Hướng dẫn SEO & Chuyển đổi tên miền
├── prisma/
│   └── schema.prisma                 # Schema PostgreSQL & Prisma ORM Models
├── public/                           # Tài nguyên tĩnh (Logo, Icons, Ảnh cửa hàng)
├── src/
│   ├── actions/                      # Next.js Server Actions (adminActions, authActions, orderActions)
│   ├── app/                          # App Router (Next.js 15)
│   │   ├── (site)/                   # Giao diện Khách hàng (Trang chủ, Sản phẩm, Giỏ hàng, Đơn hàng)
│   │   ├── admin/                    # Dashboard Quản trị viên (Đơn hàng, Sản phẩm, Dịch vụ, Gallery)
│   │   ├── api/                      # API Endpoints (Address, Gallery, OG Image Generator)
│   │   ├── layout.tsx                # Root Layout & Metadata
│   │   ├── sitemap.ts                # Dynamic Sitemap Generator
│   │   └── robots.ts                 # Dynamic Robots Generator
│   ├── components/                   # React Components theo từng Module tính năng
│   │   ├── account/                  # Hồ sơ & Cài đặt tài khoản
│   │   ├── admin/                    # Giao diện Dashboard & In phiếu đơn hàng
│   │   ├── auth/                     # Form Đăng nhập, Đăng ký, Google One-Tap
│   │   ├── cart/                     # Giỏ hàng & Thanh toán nhanh
│   │   ├── home/                     # Hero, Danh mục, Slider thương hiệu, Dịch vụ, Bản đồ
│   │   ├── layout/                   # Header, Footer, Thanh liên hệ cố định
│   │   ├── order/                    # Tra cứu đơn hàng & Lịch sử đơn hàng
│   │   └── product/                  # Danh mục sản phẩm, Chi tiết sản phẩm, Bộ lọc, Tính BTU
│   ├── context/                      # State toàn cục (AuthContext, CartContext)
│   ├── data/                         # Fallback Data mặc định (company.ts)
│   ├── lib/                          # Singletons & Utilities (prisma, cachedData, auth, rateLimit)
│   ├── types/                        # TypeScript Interfaces & DTOs
│   └── middleware.ts                 # Route Guard (Bảo vệ đường dẫn /admin và /tai-khoan)
├── next.config.js                    # Cấu hình Next.js (serverExternalPackages, Blob patterns)
└── package.json                      # Dependencies & Scripts
```

---

## 🛠️ 4. Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Setup)

### Yêu cầu môi trường:
* Node.js version 18.18+ hoặc 20+
* Cơ sở dữ liệu PostgreSQL (Supabase / Neon / Local Postgres)

### Các bước cài đặt:

1. **Clone repository và cài đặt thư viện**:
   ```bash
   git clone https://github.com/tranvanhuy-dev-it/VTDK.git
   cd VTDK
   npm install
   ```

2. **Cấu hình biến môi trường**:
   Tạo file `.env` tại thư mục gốc với các thông số:
   ```env
   # Database Connection (Supabase Direct / Pooler)
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

   # Mật khẩu quản trị mặc định
   ADMIN_PASSWORD="vattudongkhaadmin2026@"

   # Google OAuth 2.0 Client ID
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # JWT Secret Token Key
   JWT_SECRET="vattudongkha_jwt_secret_key_2026_secure_random"

   # Domain Website
   NEXT_PUBLIC_SITE_URL="https://vattudongkha.io.vn"

   # Vercel Blob Storage Token (Cho tính năng upload ảnh sản phẩm)
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"
   ```

3. **Khởi tạo Prisma Client & Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Chạy máy chủ phát triển (Development Server)**:
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại địa chỉ: [http://localhost:3000](http://localhost:3000).

5. **Biên dịch thử nghiệm Production (Build Test)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🚀 5. Hướng Dẫn Triển Khai Lên Vercel (Production Deployment)

1. Đẩy mã nguồn lên kho chứa GitHub / GitLab.
2. Tạo dự án mới trên [Vercel](https://vercel.com/) và import repository.
3. Trong phần **Environment Variables**, thêm đầy đủ các biến môi trường như trong file `.env`.
4. Bấm **Deploy**.
5. Sau khi deploy hoàn tất, thêm domain chính thức vào **Google Cloud Console > Authorized JavaScript origins** để kích hoạt Đăng nhập Google.

---

## 📄 Bản Quyền & Giấy Phép

Phát triển bởi **Công ty TNHH Vật Tư Điện Lạnh Đông Kha** © 2026. Mọi quyền được bảo lưu.
