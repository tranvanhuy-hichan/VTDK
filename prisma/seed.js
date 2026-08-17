import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Create Categories
  const categoriesData = [
    { name: "Ống Đồng Điện Lạnh", slug: "ong-dong" },
    { name: "Gas Lạnh Chính Hãng", slug: "gas-lanh" },
    { name: "Linh Kiện Điều Hòa", slug: "linh-kien-dieu-hoa" },
    { name: "Linh Kiện Tủ Lạnh", slug: "linh-kien-tu-lanh" },
    { name: "Linh Kiện Máy Giặt", slug: "linh-kien-may-giat" },
    { name: "Vật Tư & Nhớt Lạnh", slug: "vat-tu-khac" }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat
    });
    categories[cat.slug] = created;
  }

  // 2. Create Sample Products
  const products = [
    {
      name: "Ống đồng cuộn Luvata Thái Lan 6.35 + 9.52",
      slug: "ong-dong-cuon-luvata-thai-lan-6.35-9.52",
      price: 1250000,
      shortDesc: "Ống đồng cuộn nhập khẩu chính hãng Thái Lan cho gas R32, R410A, R22.",
      image: "/images/copper_pipes.jpg",
      categorySlug: "ong-dong"
    },
    {
      name: "Ống đồng cây kỹ thuật Hailiang phi 15.88",
      slug: "ong-dong-cay-ky-thuat-hailiang-phi-15.88",
      price: 2450000,
      shortDesc: "Ống đồng dạng cây dài 2.9m, độ dày 1.0mm đạt chuẩn kỹ thuật ASTM B280.",
      image: "/images/copper_pipes.jpg",
      categorySlug: "ong-dong"
    },
    {
      name: "Gas lạnh R32 Chemours Freon Mỹ",
      slug: "gas-lanh-r32-chemours-freon-my",
      price: 2100000,
      shortDesc: "Bình gas R32 9.5kg chính hãng từ Chemours (Mỹ) cho hiệu suất lạnh vượt trội.",
      image: "/images/refrigerant_gas.jpg",
      categorySlug: "gas-lanh"
    },
    {
      name: "Gas lạnh R410A Honeywell Genetron",
      slug: "gas-lanh-r410a-honeywell-genetron",
      price: 2800000,
      shortDesc: "Bình gas lạnh R410A 11.3kg đạt độ tinh khiết cao bảo vệ máy nén tối ưu.",
      image: "/images/refrigerant_gas.jpg",
      categorySlug: "gas-lanh"
    },
    {
      name: "Block (Lốc nén) máy lạnh Daikin 1.5 HP Inverter",
      slug: "block-loc-nen-may-lanh-daikin-1.5-hp-inverter",
      price: 3500000,
      shortDesc: "Máy nén xoắn ốc (Scroll) chính hãng Daikin cho dòng máy Inverter tiết kiệm điện.",
      image: "/images/ac_components.jpg",
      categorySlug: "linh-kien-dieu-hoa"
    },
    {
      name: "Bo mạch điều hòa Daikin Inverter ga R32",
      slug: "bo-mach-dieu-hoa-daikin-inverter-ga-r32",
      price: 1800000,
      shortDesc: "Bo mạch điều khiển dàn lạnh Daikin chính hãng thay thế tương thích tốt.",
      image: "/images/ac_components.jpg",
      categorySlug: "linh-kien-dieu-hoa"
    },
    {
      name: "Bộ rơ le Defrost Timer tủ lạnh Toshiba 1-3",
      slug: "bo-ro-le-defrost-timer-tu-lanh-toshiba-1-3",
      price: 250000,
      shortDesc: "Bộ điều khiển xả đá chu kỳ 1-3 chất lượng cao giúp duy trì độ lạnh sâu.",
      image: "/images/ac_components.jpg",
      categorySlug: "linh-kien-tu-lanh"
    },
    {
      name: "Van cấp nước máy giặt Electrolux lồng ngang đôi",
      slug: "van-cap-nuoc-may-giat-electrolux-long-ngang-doi",
      price: 320000,
      shortDesc: "Van cấp nước kép 220V cho dòng máy giặt Electrolux cửa ngang chính hãng.",
      image: "/images/ac_components.jpg",
      categorySlug: "linh-kien-may-giat"
    },
    {
      name: "Nhớt lạnh Suniso 4GS chính hãng Nhật Bản",
      slug: "nhot-lanh-suniso-4gs-chinh-hang-nhat-ban",
      price: 950000,
      shortDesc: "Nhớt lạnh bôi trơn máy nén Suniso lon 4 lít cho gas R22, R12, R502.",
      image: "/images/storefront.png",
      categorySlug: "vat-tu-khac"
    }
  ];

  for (const prod of products) {
    const category = categories[prod.categorySlug];
    if (!category) continue;

    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        price: prod.price,
        shortDesc: prod.shortDesc,
        image: prod.image,
        active: true,
        categoryId: category.id
      }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
