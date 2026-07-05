import apiClient from "./client";
import { apiEndpoints } from "./endpoints";

export function getActivityFeed() {
  return apiClient.get(apiEndpoints.activityFeed);
}

export function getSystemMetrics() {
  return apiClient.get(apiEndpoints.systemMetrics);
}
