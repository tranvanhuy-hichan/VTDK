"use server";

import { createAdminAction } from "../server/actionClient";
import * as analyticsService from "../services/analytics.service";
import type { AnalyticsData } from "../services/analytics.service";

export type {
  AnalyticsData,
  AnalyticsSummary,
  TimelineDataPoint,
  TopProductItem,
  CategoryRevenueItem,
  ShippingBreakdown,
  LowStockProductItem,
} from "../services/analytics.service";

/**
 * Fetch comprehensive business analytics and revenue reports for admin
 */
export async function getAdminAnalyticsAction(
  timeRange: "7d" | "30d" | "this_month" | "last_month" | "all" = "30d"
): Promise<{ success: boolean; data?: AnalyticsData; error?: string }> {
  return createAdminAction(async () => {
    return analyticsService.getAdminAnalytics(timeRange);
  }, null);
}
