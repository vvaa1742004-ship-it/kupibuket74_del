export type Role = "ADMIN" | "COURIER";
export type OrderStatus =
  | "NEW"
  | "ASSIGNED"
  | "PICKED_UP"
  | "DELIVERED"
  | "PROBLEM"
  | "CANCELED";
export type OrderPriority = "VIP" | "URGENT" | "NORMAL";

export interface Actor {
  tg_user_id: number;
  role: Role;
  full_name?: string | null;
  phone?: string | null;
}

export interface AuthResponse {
  access_token: string;
  actor: Actor;
}

export interface Order {
  id: number;
  order_number: string;
  priority: OrderPriority;
  priority_label: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_window_start: string;
  delivery_window_end: string;
  comment?: string | null;
  address_text: string;
  entrance?: string | null;
  floor?: string | null;
  apartment?: string | null;
  intercom_code?: string | null;
  details?: string | null;
  lat?: number | null;
  lon?: number | null;
  pickup_point_name?: string | null;
  pickup_point_address?: string | null;
  assigned_courier_id?: number | null;
  assigned_courier_name?: string | null;
  batch_id?: number | null;
  eta_minutes?: number | null;
  distance_km?: number | null;
  duration_minutes?: number | null;
  problem_reason?: string | null;
  canceled_reason?: string | null;
  proof_photo_file_id?: string | null;
  proof_comment?: string | null;
  courier_distance_km?: number | null;
  courier_location?: {
    lat: number;
    lon: number;
    timestamp: string;
    map_url: string;
  } | null;
  history: Array<{
    old_status?: OrderStatus | null;
    new_status: OrderStatus;
    actor_tg_user_id: number;
    note?: string | null;
    created_at: string;
  }>;
}


export interface Courier {
  tg_user_id: number;
  full_name: string;
  phone: string;
  is_active: boolean;
}

export interface BatchResponse {
  batch_id?: number | null;
  status?: "ACTIVE" | "COMPLETED" | null;
  completed: number;
  remaining: number;
  total: number;
  next_order_id?: number | null;
  orders: Order[];
}
