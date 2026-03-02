import axios from "axios";
import type { AuthResponse, BatchResponse, Courier, Order } from "../types";
import {
  assignOrderMock,
  authenticateMock,
  fetchAnalyticsMock,
  fetchCouriersMock,
  fetchCurrentBatchMock,
  fetchOrderMock,
  fetchOrdersMock,
  patchOrderMock,
  postCourierLocationMock,
  updateOrderStatusMock
} from "./mockApi";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const demoMode = import.meta.env.VITE_DEMO_MODE === "true";

console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL, "DEMO:", import.meta.env.VITE_DEMO_MODE);
console.log("API client baseURL:", apiBaseUrl || "(not set)");

const client = axios.create({
  baseURL: apiBaseUrl || undefined
});

function ensureApiConfigured(): void {
  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured. Set the backend API URL in Vercel environment variables.");
  }
}

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}

export function isDemoMode(): boolean {
  return demoMode;
}

export function setToken(token: string | null): void {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

export async function authenticate(initData: string): Promise<AuthResponse> {
  if (demoMode) {
    return authenticateMock(initData);
  }
  ensureApiConfigured();
  const { data } = await client.post<AuthResponse>("auth/telegram", { init_data: initData });
  return data;
}

export async function fetchMe(): Promise<{ actor: AuthResponse["actor"] }> {
  if (demoMode) {
    const auth = await authenticateMock("");
    return { actor: auth.actor };
  }
  ensureApiConfigured();
  const { data } = await client.get("auth/me");
  return data;
}

export async function fetchOrders(params?: Record<string, string | number | string[]>): Promise<Order[]> {
  if (demoMode) {
    return fetchOrdersMock(params);
  }
  ensureApiConfigured();
  const { data } = await client.get<Order[]>("orders", { params });
  return data;
}

export async function fetchOrder(orderId: string): Promise<Order> {
  if (demoMode) {
    return fetchOrderMock(orderId);
  }
  ensureApiConfigured();
  const { data } = await client.get<Order>(`orders/${orderId}`);
  return data;
}

export async function updateOrderStatus(orderId: number, payload: Record<string, unknown>): Promise<Order> {
  if (demoMode) {
    return updateOrderStatusMock(orderId, payload);
  }
  ensureApiConfigured();
  const { data } = await client.post<Order>(`orders/${orderId}/status`, payload);
  return data;
}

export async function assignOrder(orderId: number, courierId: number): Promise<Order> {
  if (demoMode) {
    return assignOrderMock(orderId, courierId);
  }
  ensureApiConfigured();
  const { data } = await client.post<Order>(`orders/${orderId}/assign`, {
    courier_id: courierId
  });
  return data;
}

export async function patchOrder(orderId: number, payload: Record<string, unknown>): Promise<Order> {
  if (demoMode) {
    return patchOrderMock(orderId, payload);
  }
  ensureApiConfigured();
  const { data } = await client.patch<Order>(`orders/${orderId}`, payload);
  return data;
}

export async function fetchCouriers(): Promise<Courier[]> {
  if (demoMode) {
    return fetchCouriersMock();
  }
  ensureApiConfigured();
  const { data } = await client.get<Courier[]>("couriers");
  return data;
}

export async function fetchCurrentBatch(): Promise<BatchResponse> {
  if (demoMode) {
    return fetchCurrentBatchMock();
  }
  ensureApiConfigured();
  const { data } = await client.get<BatchResponse>("batches/current");
  return data;
}

export async function postCourierLocation(lat: number, lon: number): Promise<void> {
  if (demoMode) {
    return postCourierLocationMock();
  }
  ensureApiConfigured();
  await client.post("couriers/location", { lat, lon });
}

export async function fetchAnalytics(): Promise<{
  summary: string;
  couriers: Array<Record<string, unknown>>;
  pickup_points: Array<Record<string, unknown>>;
}> {
  if (demoMode) {
    return fetchAnalyticsMock();
  }
  ensureApiConfigured();
  const { data } = await client.get("analytics/summary");
  return data;
}
