export const apiEndpoints = {
  traders: "/traders",
  traderById: (traderId) => `/traders/${traderId}`,
  traderPortfolio: (traderId) => `/traders/${traderId}/portfolio`,
  marketSnapshot: "/market/snapshot",
  balanceHistory: "/market/balance-history",
  activityFeed: "/activity-feed",
  systemMetrics: "/system-metrics",
};
