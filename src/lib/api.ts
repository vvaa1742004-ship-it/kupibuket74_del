import axios from "axios";
import type { AuthResponse, BatchResponse, Courier, Order } from "../types";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1"
});

export function setToken(token: string | null): void {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

export async function authenticate(initData: string): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>("/auth/telegram", { init_data: initData });
  return data;
}

export async function fetchMe(): Promise<{ actor: AuthResponse["actor"] }> {
  const { data } = await client.get("/auth/me");
  return data;
}

export async function fetchOrders(params?: Record<string, string | number | string[]>): Promise<Order[]> {
  const { data } = await client.get<Order[]>("/orders", { params });
  return data;
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const { data } = await client.get<Order>(`/orders/${orderId}`);
  return data;
}

export async function updateOrderStatus(orderId: number, payload: Record<string, unknown>): Promise<Order> {
  const { data } = await client.post<Order>(`/orders/${orderId}/status`, payload);
  return data;
}

export async function assignOrder(orderId: number, courierId: number): Promise<Order> {
  const { data } = await client.post<Order>(`/orders/${orderId}/assign`, { courier_id: courierId });
  return data;
}

export async function patchOrder(orderId: number, payload: Record<string, unknown>): Promise<Order> {
  const { data } = await client.patch<Order>(`/orders/${orderId}`, payload);
  return data;
}

export async function fetchCouriers(): Promise<Courier[]> {
  const { data } = await client.get<Courier[]>("/couriers");
  return data;
}

export async function fetchCurrentBatch(): Promise<BatchResponse> {
  const { data } = await client.get<BatchResponse>("/batches/current");
  return data;
}

export async function postCourierLocation(lat: number, lon: number): Promise<void> {
  await client.post("/couriers/location", { lat, lon });
}

export async function fetchAnalytics(): Promise<{
  summary: string;
  couriers: Array<Record<string, unknown>>;
  pickup_points: Array<Record<string, unknown>>;
}> {
  const { data } = await client.get("/analytics/summary");
  return data;
}

