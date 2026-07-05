import apiClient from "./client";
import { apiEndpoints } from "./endpoints";

export function getMarketSnapshot() {
  return apiClient.get(apiEndpoints.marketSnapshot);
}

export function getBalanceHistory() {
  return apiClient.get(apiEndpoints.balanceHistory);
}
