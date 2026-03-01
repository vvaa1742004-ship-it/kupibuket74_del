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

const demoMode = import.meta.env.VITE_DEMO_MODE !== "false";

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
  if (demoMode) {
    return authenticateMock(initData);
  }
  const { data } = await client.post<AuthResponse>("/auth/telegram", { init_data: initData });
  return data;
}

export async function fetchMe(): Promise<{ actor: AuthResponse["actor"] }> {
  const { data } = await client.get("/auth/me");
  return data;
}

export async function fetchOrders(params?: Record<string, string | number | string[]>): Promise<Order[]> {
  if (demoMode) {
    return fetchOrdersMock(params);
  }
  const { data } = await client.get<Order[]>("/orders", { params });
  return data;
}

export async function fetchOrder(orderId: string): Promise<Order> {
  if (demoMode) {
    return fetchOrderMock(orderId);
  }
  const { data } = await client.get<Order>(`/orders/${orderId}`);
  return data;
}

export async function updateOrderStatus(orderId: number, payload: Record<string, unknown>): Promise<Order> {
  if (demoMode) {
    return updateOrderStatusMock(orderId, payload);
  }
  const { data } = await client.post<Order>(`/orders/${orderId}/status`, payload);
  return data;
}

export async function assignOrder(orderId: number, courierId: number): Promise<Order> {
  if (demoMode) {
    return assignOrderMock(orderId, courierId);
  }
  const { data } = await client.post<Order>(`/orders/${orderId}/assign`, { courier_id: courierId });
  return data;
}

export async function patchOrder(orderId: number, payload: Record<string, unknown>): Promise<Order> {
  if (demoMode) {
    return patchOrderMock(orderId, payload);
  }
  const { data } = await client.patch<Order>(`/orders/${orderId}`, payload);
  return data;
}

export async function fetchCouriers(): Promise<Courier[]> {
  if (demoMode) {
    return fetchCouriersMock();
  }
  const { data } = await client.get<Courier[]>("/couriers");
  return data;
}

export async function fetchCurrentBatch(): Promise<BatchResponse> {
  if (demoMode) {
    return fetchCurrentBatchMock();
  }
  const { data } = await client.get<BatchResponse>("/batches/current");
  return data;
}

export async function postCourierLocation(lat: number, lon: number): Promise<void> {
  if (demoMode) {
    return postCourierLocationMock();
  }
  await client.post("/couriers/location", { lat, lon });
}

export async function fetchAnalytics(): Promise<{
  summary: string;
  couriers: Array<Record<string, unknown>>;
  pickup_points: Array<Record<string, unknown>>;
}> {
  if (demoMode) {
    return fetchAnalyticsMock();
  }
  const { data } = await client.get("/analytics/summary");
  return data;
}
