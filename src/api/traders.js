import apiClient from "./client";
import { apiEndpoints } from "./endpoints";

export function getTraders() {
  return apiClient.get(apiEndpoints.traders);
}

export function getTraderById(traderId) {
  return apiClient.get(apiEndpoints.traderById(traderId));
}

export function getTraderPortfolio(traderId) {
  return apiClient.get(apiEndpoints.traderPortfolio(traderId));
}
