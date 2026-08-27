import { prisma } from "../lib/prisma";

export interface AnalyticsSummary {
  totalRevenue: number;
  completedRevenue: number;
  pendingRevenue: number;
  onlineRevenue: number;
  onlineOrders: number;
  posRevenue: number;
  posOrders: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

export interface TimelineDataPoint {
  date: string;
  label: string;
  revenue: number;
  orderCount: number;
}

export interface TopProductItem {
  productName: string;
  productSlug: string;
  image: string;
  price: number;
  totalQty: number;
  totalRevenue: number;
}

export interface CategoryRevenueItem {
  categoryName: string;
  revenue: number;
  itemCount: number;
  percentage: number;
}

export interface ShippingBreakdown {
  deliveryCount: number;
  deliveryRevenue: number;
  storePickupCount: number;
  storePickupRevenue: number;
}

export interface LowStockProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  stock: number;
  price: number;
  categoryName: string;
  variantCount: number;
}

export interface AnalyticsData {
  timeRange: string;
  summary: AnalyticsSummary;
  timeline: TimelineDataPoint[];
  topProducts: TopProductItem[];
  categoryBreakdown: CategoryRevenueItem[];
  shippingBreakdown: ShippingBreakdown;
  lowStockProducts?: LowStockProductItem[];
  recentOrders: {
    id: string;
    orderCode: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
}

export async function getAdminAnalytics(
  timeRange: "7d" | "30d" | "this_month" | "last_month" | "all" = "30d"
): Promise<AnalyticsData> {
  const now = new Date();
  let startDate: Date | undefined;
  let endDate: Date = now;

  if (timeRange === "7d") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
  } else if (timeRange === "30d") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 30);
  } else if (timeRange === "this_month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (timeRange === "last_month") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  }

  const dateFilter = startDate ? { gte: startDate, lte: endDate } : undefined;

  // 1. Fetch Orders in the selected range
  const orders = await prisma.order.findMany({
    where: dateFilter ? { createdAt: dateFilter } : undefined,
    include: {
      items: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // 2. Compute Summary Metrics
  let totalRevenue = 0;
  let completedRevenue = 0;
  let pendingRevenue = 0;
  let onlineRevenue = 0;
  let onlineOrders = 0;
  let posRevenue = 0;
  let posOrders = 0;
  let completedOrders = 0;
  let pendingOrders = 0;
  let cancelledOrders = 0;
  let totalItemsSold = 0;
  let deliveryCount = 0;
  let deliveryRevenue = 0;
  let storePickupCount = 0;
  let storePickupRevenue = 0;

  const productMap = new Map<
    string,
    {
      productName: string;
      productSlug: string;
      image: string;
      price: number;
      totalQty: number;
      totalRevenue: number;
    }
  >();

  // Map for timeline grouping (by YYYY-MM-DD)
  const timelineMap = new Map<string, { revenue: number; count: number }>();

  for (const order of orders) {
    if (order.status !== "CANCELLED") {
      totalRevenue += order.totalAmount;
    }

    const isPos = (order as any).orderSource === "POS" || order.orderCode.startsWith("POS-");
    if (isPos) {
      posOrders++;
      if (order.status !== "CANCELLED") posRevenue += order.totalAmount;
    } else {
      onlineOrders++;
      if (order.status !== "CANCELLED") onlineRevenue += order.totalAmount;
    }

    if (order.status === "COMPLETED") {
      completedOrders++;
      completedRevenue += order.totalAmount;
    } else if (order.status === "CANCELLED") {
      cancelledOrders++;
    } else {
      pendingOrders++;
      pendingRevenue += order.totalAmount;
    }

    if (order.shippingMethod === "STORE_PICKUP") {
      storePickupCount++;
      if (order.status !== "CANCELLED") storePickupRevenue += order.totalAmount;
    } else {
      deliveryCount++;
      if (order.status !== "CANCELLED") deliveryRevenue += order.totalAmount;
    }

    // Group timeline by date
    const dateKey = order.createdAt.toISOString().split("T")[0];
    const existingTimeline = timelineMap.get(dateKey) || { revenue: 0, count: 0 };
    if (order.status !== "CANCELLED") {
      existingTimeline.revenue += order.totalAmount;
    }
    existingTimeline.count += 1;
    timelineMap.set(dateKey, existingTimeline);

    // Aggregate Products from OrderItems
    for (const item of order.items) {
      if (order.status !== "CANCELLED") {
        totalItemsSold += item.quantity;
        const prodKey = item.productSlug || item.productName;
        const existingProd = productMap.get(prodKey);
        const itemRevenue = item.price * item.quantity;

        if (existingProd) {
          existingProd.totalQty += item.quantity;
          existingProd.totalRevenue += itemRevenue;
        } else {
          productMap.set(prodKey, {
            productName: item.productName,
            productSlug: item.productSlug,
            image: item.image || "/images/storefront.png",
            price: item.price,
            totalQty: item.quantity,
            totalRevenue: itemRevenue,
          });
        }
      }
    }
  }

  const nonCancelledOrders = orders.length - cancelledOrders;
  const conversionRate = orders.length > 0 ? (completedOrders / orders.length) * 100 : 0;
  const averageOrderValue = nonCancelledOrders > 0 ? totalRevenue / nonCancelledOrders : 0;

  // 3. Format Timeline
  const timeline: TimelineDataPoint[] = Array.from(timelineMap.entries()).map(([dateStr, val]) => {
    const parts = dateStr.split("-");
    const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr;
    return {
      date: dateStr,
      label,
      revenue: val.revenue,
      orderCount: val.count,
    };
  });

  // 4. Sort Top Products & Fetch High-Res Images from Product table
  const topProductsRaw = Array.from(productMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  const slugs = topProductsRaw.map((p) => p.productSlug).filter(Boolean);
  const dbProducts =
    slugs.length > 0
      ? await prisma.product.findMany({
          where: { slug: { in: slugs } },
          select: { slug: true, image: true, images: true },
        })
      : [];
  const dbProdMap = new Map(
    dbProducts.map((p) => [p.slug, p.image || (p.images && p.images[0]) || ""])
  );

  const topProducts: TopProductItem[] = topProductsRaw.map((p) => ({
    ...p,
    image: dbProdMap.get(p.productSlug) || p.image || "/images/placeholder.svg",
  }));

  // 5. Fetch Categories for breakdown estimate
  const categories = await prisma.category.findMany({
    include: {
      products: {
        select: { slug: true },
      },
    },
  });

  const categoryMap = new Map<string, { revenue: number; count: number }>();
  for (const cat of categories) {
    categoryMap.set(cat.name, { revenue: 0, count: 0 });
    const slugSet = new Set(cat.products.map((p) => p.slug));

    for (const prod of productMap.values()) {
      if (slugSet.has(prod.productSlug)) {
        const catStat = categoryMap.get(cat.name)!;
        catStat.revenue += prod.totalRevenue;
        catStat.count += prod.totalQty;
      }
    }
  }

  const categoryBreakdown: CategoryRevenueItem[] = Array.from(categoryMap.entries())
    .map(([categoryName, data]) => ({
      categoryName,
      revenue: data.revenue,
      itemCount: data.count,
      percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // 6. Recent Orders
  const recentOrders = orders
    .slice(-6)
    .reverse()
    .map((o) => ({
      id: o.id,
      orderCode: o.orderCode,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    }));

  // 7. Fetch Low Stock Products (stock <= 5)
  let lowStockProducts: LowStockProductItem[] = [];
  try {
    const lowStockRaw = await prisma.product.findMany({
      where: { active: true, stock: { lte: 5 } },
      include: {
        category: { select: { name: true } },
        variants: { select: { id: true } },
      },
      orderBy: { stock: "asc" },
      take: 12,
    });

    lowStockProducts = lowStockRaw.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku || null,
      stock: p.stock ?? 0,
      price: p.price,
      categoryName: p.category?.name || "Khác",
      variantCount: p.variants?.length || 0,
    }));
  } catch (stockErr) {
    console.warn("Could not query low stock products:", stockErr);
  }

  return {
    timeRange,
    summary: {
      totalRevenue,
      completedRevenue,
      pendingRevenue,
      onlineRevenue,
      onlineOrders,
      posRevenue,
      posOrders,
      totalOrders: orders.length,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageOrderValue: Math.round(averageOrderValue),
      totalItemsSold,
    },
    timeline,
    topProducts,
    categoryBreakdown,
    shippingBreakdown: {
      deliveryCount,
      deliveryRevenue,
      storePickupCount,
      storePickupRevenue,
    },
    lowStockProducts,
    recentOrders,
  };
}
