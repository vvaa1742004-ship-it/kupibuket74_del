import type { AuthResponse, BatchResponse, Courier, Order } from "../types";

const now = new Date();

const couriers: Courier[] = [
  { tg_user_id: 100001, full_name: "Тестовый Курьер 1", phone: "+79990000001", is_active: true },
  { tg_user_id: 100002, full_name: "Тестовый Курьер 2", phone: "+79990000002", is_active: true }
];

let orders: Order[] = [
  {
    id: 1,
    order_number: "TEST-001",
    priority: "VIP",
    priority_label: "🔴 VIP",
    status: "NEW",
    customer_name: "Иван Заказчик",
    customer_phone: "+79991112233",
    recipient_name: "Анна",
    recipient_phone: "+79990000011",
    delivery_window_start: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
    delivery_window_end: new Date(now.getTime() + 90 * 60 * 1000).toISOString(),
    comment: "Позвонить за 10 минут",
    address_text: "Москва, Тверская 1",
    entrance: "1",
    floor: "5",
    apartment: "15",
    intercom_code: "15К",
    details: "Цветы у консьержа не оставлять",
    lat: 55.7579,
    lon: 37.6156,
    pickup_point_name: "Салон Центр",
    pickup_point_address: "Москва, Тверская 1",
    assigned_courier_id: null,
    assigned_courier_name: null,
    batch_id: null,
    eta_minutes: 25,
    distance_km: 2.3,
    history: []
  },
  {
    id: 2,
    order_number: "TEST-002",
    priority: "URGENT",
    priority_label: "🟠 Срочный",
    status: "ASSIGNED",
    customer_name: "Мария Заказчик",
    customer_phone: "+79991112234",
    recipient_name: "Олег",
    recipient_phone: "+79990000012",
    delivery_window_start: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
    delivery_window_end: new Date(now.getTime() + 70 * 60 * 1000).toISOString(),
    comment: "Курьеру позвонить в домофон",
    address_text: "Москва, Арбат 7",
    entrance: "2",
    floor: "4",
    apartment: "8",
    intercom_code: "24",
    details: "Доставка срочная",
    lat: 55.7522,
    lon: 37.5925,
    pickup_point_name: "Салон Центр",
    pickup_point_address: "Москва, Тверская 1",
    assigned_courier_id: 100001,
    assigned_courier_name: "Тестовый Курьер 1",
    batch_id: 501,
    eta_minutes: 18,
    distance_km: 1.4,
    courier_distance_km: 1.2,
    courier_location: {
      lat: 55.76,
      lon: 37.61,
      timestamp: now.toISOString(),
      map_url: "https://www.google.com/maps?q=55.76,37.61"
    },
    history: [
      {
        old_status: "NEW",
        new_status: "ASSIGNED",
        actor_tg_user_id: 100001,
        note: "Взят курьером",
        created_at: now.toISOString()
      }
    ]
  }
];

function inferRole(): "ADMIN" | "COURIER" {
  return window.location.pathname.startsWith("/admin") ? "ADMIN" : "COURIER";
}

function parseTelegramUser(initData: string): { id: number; first_name?: string } | null {
  const params = new URLSearchParams(initData);
  const raw = params.get("user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as { id: number; first_name?: string };
  } catch {
    return null;
  }
}

export async function authenticateMock(initData: string): Promise<AuthResponse> {
  const role = inferRole();
  const user = parseTelegramUser(initData);
  return {
    access_token: "demo-token",
    actor: {
      tg_user_id: user?.id || (role === "ADMIN" ? 826701279 : 100001),
      role,
      full_name: user?.first_name || (role === "ADMIN" ? "Admin Demo" : "Courier Demo")
    }
  };
}

export async function fetchOrdersMock(params?: Record<string, string | number | string[]>): Promise<Order[]> {
  let result = [...orders];
  const statusFilter = params?.status;
  const query = String(params?.query || "").toLowerCase();
  const priority = String(params?.priority || "");
  if (Array.isArray(statusFilter) && statusFilter.length) {
    result = result.filter((item) => statusFilter.includes(item.status));
  } else if (typeof statusFilter === "string" && statusFilter) {
    result = result.filter((item) => item.status === statusFilter);
  }
  if (query) {
    result = result.filter((item) =>
      [
        item.order_number,
        item.customer_phone,
        item.recipient_phone,
        item.customer_name,
        item.recipient_name,
        item.address_text
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }
  if (priority) {
    result = result.filter((item) => item.priority === priority);
  }
  return result;
}

export async function fetchOrderMock(orderId: string): Promise<Order> {
  const order = orders.find((item) => item.id === Number(orderId));
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
}

export async function updateOrderStatusMock(
  orderId: number,
  payload: Record<string, unknown>
): Promise<Order> {
  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  const nextStatus = String(payload.status) as Order["status"];
  order.history.unshift({
    old_status: order.status,
    new_status: nextStatus,
    actor_tg_user_id: inferRole() === "ADMIN" ? 826701279 : 100001,
    note: (payload.reason as string) || null,
    created_at: new Date().toISOString()
  });
  order.status = nextStatus;
  if (nextStatus === "DELIVERED") {
    order.duration_minutes = 32;
    order.proof_photo_file_id = "demo-proof";
  }
  return order;
}

export async function assignOrderMock(orderId: number, courierId: number): Promise<Order> {
  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  const courier = couriers.find((item) => item.tg_user_id === courierId);
  order.assigned_courier_id = courierId;
  order.assigned_courier_name = courier?.full_name || null;
  order.batch_id = 501;
  order.status = "ASSIGNED";
  return order;
}

export async function patchOrderMock(
  orderId: number,
  payload: Record<string, unknown>
): Promise<Order> {
  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  Object.assign(order, payload);
  return order;
}

export async function fetchCouriersMock(): Promise<Courier[]> {
  return couriers;
}

export async function fetchCurrentBatchMock(): Promise<BatchResponse> {
  const route = orders.filter((item) => item.assigned_courier_id === 100001 && item.status !== "DELIVERED");
  return {
    batch_id: 501,
    status: "ACTIVE",
    completed: orders.filter((item) => item.status === "DELIVERED").length,
    remaining: route.length,
    total: route.length,
    next_order_id: route[0]?.id || null,
    orders: route
  };
}

export async function postCourierLocationMock(): Promise<void> {
  return;
}

export async function fetchAnalyticsMock(): Promise<{
  summary: string;
  couriers: Array<Record<string, unknown>>;
  pickup_points: Array<Record<string, unknown>>;
}> {
  return {
    summary:
      "Курьеры:\n100001: взято 2, выполнено 0, ср. 0 мин, проблемных 0%, просрочек 0%\n\nТочки выдачи:\n1: 2 заказа, ср. 0 мин",
    couriers: [{ courier_id: 100001, taken: 2, delivered: 0, avg_minutes: 0, problem_pct: 0, late_pct: 0 }],
    pickup_points: [{ pickup_point_id: 1, orders: 2, avg_minutes: 0 }]
  };
}

