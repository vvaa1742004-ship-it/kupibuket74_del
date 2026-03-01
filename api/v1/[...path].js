const PRIORITY_WEIGHT = {
  VIP: 0,
  URGENT: 1,
  NORMAL: 2
};

const STATUS_ACTIVE = new Set(["ASSIGNED", "PICKED_UP", "PROBLEM"]);
const ADMIN_IDS = (process.env.ADMIN_IDS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const now = new Date();

const couriers = [
  { tg_user_id: 100001, full_name: "Тестовый Курьер 1", phone: "+79990000001", is_active: true },
  { tg_user_id: 100002, full_name: "Тестовый Курьер 2", phone: "+79990000002", is_active: true }
];

const courierLocations = {
  100001: {
    lat: 55.76,
    lon: 37.61,
    timestamp: now.toISOString(),
    map_url: "https://www.google.com/maps?q=55.76,37.61"
  },
  100002: {
    lat: 55.74,
    lon: 37.63,
    timestamp: now.toISOString(),
    map_url: "https://www.google.com/maps?q=55.74,37.63"
  }
};

const orders = [
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
    pickup_point_id: 1,
    pickup_point_name: "Салон Центр",
    pickup_point_address: "Москва, Тверская 1",
    assigned_courier_id: null,
    assigned_courier_name: null,
    batch_id: null,
    created_at: now.toISOString(),
    assigned_at: null,
    picked_up_at: null,
    delivered_at: null,
    duration_minutes: null,
    eta_minutes: 25,
    distance_km: 2.3,
    problem_reason: null,
    canceled_reason: null,
    proof_photo_file_id: null,
    proof_comment: null,
    courier_distance_km: null,
    courier_location: null,
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
    pickup_point_id: 1,
    pickup_point_name: "Салон Центр",
    pickup_point_address: "Москва, Тверская 1",
    assigned_courier_id: 100001,
    assigned_courier_name: "Тестовый Курьер 1",
    batch_id: 501,
    created_at: now.toISOString(),
    assigned_at: now.toISOString(),
    picked_up_at: null,
    delivered_at: null,
    duration_minutes: null,
    eta_minutes: 18,
    distance_km: 1.4,
    problem_reason: null,
    canceled_reason: null,
    proof_photo_file_id: null,
    proof_comment: null,
    courier_distance_km: 1.2,
    courier_location: courierLocations[100001],
    history: [
      {
        old_status: "NEW",
        new_status: "ASSIGNED",
        actor_tg_user_id: 100001,
        note: "Взят курьером",
        created_at: now.toISOString()
      }
    ]
  },
  {
    id: 3,
    order_number: "TEST-003",
    priority: "NORMAL",
    priority_label: "⚪️ Обычный",
    status: "PICKED_UP",
    customer_name: "Павел Заказчик",
    customer_phone: "+79991112235",
    recipient_name: "Елена",
    recipient_phone: "+79990000013",
    delivery_window_start: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
    delivery_window_end: new Date(now.getTime() + 40 * 60 * 1000).toISOString(),
    comment: "Подъезд со двора",
    address_text: "Москва, Варшавское шоссе 10",
    entrance: "3",
    floor: "7",
    apartment: "21",
    intercom_code: "7",
    details: "Доставка в офис",
    lat: 55.7058,
    lon: 37.6251,
    pickup_point_id: 2,
    pickup_point_name: "Салон Юг",
    pickup_point_address: "Москва, Варшавское шоссе 10",
    assigned_courier_id: 100001,
    assigned_courier_name: "Тестовый Курьер 1",
    batch_id: 501,
    created_at: now.toISOString(),
    assigned_at: now.toISOString(),
    picked_up_at: now.toISOString(),
    delivered_at: null,
    duration_minutes: null,
    eta_minutes: 32,
    distance_km: 4.1,
    problem_reason: null,
    canceled_reason: null,
    proof_photo_file_id: null,
    proof_comment: null,
    courier_distance_km: 3.7,
    courier_location: courierLocations[100001],
    history: [
      {
        old_status: "NEW",
        new_status: "ASSIGNED",
        actor_tg_user_id: 100001,
        note: "Назначен",
        created_at: now.toISOString()
      },
      {
        old_status: "ASSIGNED",
        new_status: "PICKED_UP",
        actor_tg_user_id: 100001,
        note: "Забрал из отдела",
        created_at: now.toISOString()
      }
    ]
  }
];

function parseBody(req) {
  if (!req.body) {
    return {};
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function parseInitData(initData) {
  const params = new URLSearchParams(initData || "");
  const rawUser = params.get("user");
  if (!rawUser) {
    return null;
  }
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function roleForUser(userId) {
  return ADMIN_IDS.includes(String(userId)) ? "ADMIN" : "COURIER";
}

function createToken(userId, role) {
  return Buffer.from(JSON.stringify({ sub: String(userId), role }), "utf8").toString("base64url");
}

function readToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }
  const token = header.slice(7);
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function byPriorityAndWindow(a, b) {
  const priorityDiff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  const deadlineDiff = new Date(a.delivery_window_end).getTime() - new Date(b.delivery_window_end).getTime();
  if (deadlineDiff !== 0) {
    return deadlineDiff;
  }
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

function courierName(courierId) {
  const courier = couriers.find((item) => item.tg_user_id === courierId);
  return courier ? courier.full_name : null;
}

function decorateOrder(order) {
  const cloned = { ...order };
  if (cloned.assigned_courier_id) {
    cloned.assigned_courier_name = courierName(cloned.assigned_courier_id);
    cloned.courier_location = courierLocations[cloned.assigned_courier_id] || null;
  } else {
    cloned.assigned_courier_name = null;
    cloned.courier_location = null;
  }
  return cloned;
}

function send(res, status, payload) {
  res.status(status).json(payload);
}

function notFound(res) {
  send(res, 404, { detail: "Not found" });
}

function forbidden(res) {
  send(res, 403, { detail: "Forbidden" });
}

export default function handler(req, res) {
  const path = Array.isArray(req.query.path)
    ? req.query.path
    : typeof req.query.path === "string"
      ? [req.query.path]
      : [];
  const method = req.method || "GET";
  const body = parseBody(req);

  if (path[0] === "auth" && path[1] === "telegram" && method === "POST") {
    const user = parseInitData(body.init_data);
    if (!user?.id) {
      return send(res, 401, { detail: "Invalid initData" });
    }
    const role = roleForUser(user.id);
    return send(res, 200, {
      access_token: createToken(user.id, role),
      actor: {
        tg_user_id: Number(user.id),
        role,
        full_name: user.first_name || user.username || null,
        phone: null
      }
    });
  }

  const actor = readToken(req);
  if (!actor) {
    return send(res, 401, { detail: "Missing bearer token" });
  }

  if (path[0] === "auth" && path[1] === "me" && method === "GET") {
    return send(res, 200, {
      actor: {
        tg_user_id: Number(actor.sub),
        role: actor.role,
        full_name: courierName(Number(actor.sub)),
        phone: null
      }
    });
  }

  if (path[0] === "orders" && path.length === 1 && method === "GET") {
    const statuses = Array.isArray(req.query.status)
      ? req.query.status
      : req.query.status
        ? [req.query.status]
        : [];
    const query = String(req.query.query || "").toLowerCase();
    const priority = String(req.query.priority || "");
    const courierId = req.query.courier_id ? Number(req.query.courier_id) : null;
    let data = [...orders];

    if (actor.role === "COURIER") {
      data = data.filter(
        (item) => item.status === "NEW" || item.assigned_courier_id === Number(actor.sub)
      );
    }
    if (statuses.length) {
      data = data.filter((item) => statuses.includes(item.status));
    }
    if (query) {
      data = data.filter((item) =>
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
      data = data.filter((item) => item.priority === priority);
    }
    if (courierId) {
      data = data.filter((item) => item.assigned_courier_id === courierId);
    }

    return send(res, 200, data.sort(byPriorityAndWindow).map(decorateOrder));
  }

  if (path[0] === "orders" && path.length === 2 && method === "GET") {
    const order = orders.find((item) => item.id === Number(path[1]));
    if (!order) {
      return notFound(res);
    }
    return send(res, 200, decorateOrder(order));
  }

  if (path[0] === "orders" && path.length === 2 && method === "PATCH") {
    const order = orders.find((item) => item.id === Number(path[1]));
    if (!order) {
      return notFound(res);
    }
    Object.assign(order, body);
    if (body.priority === "VIP") {
      order.priority_label = "🔴 VIP";
    }
    if (body.priority === "URGENT") {
      order.priority_label = "🟠 Срочный";
    }
    if (body.priority === "NORMAL") {
      order.priority_label = "⚪️ Обычный";
    }
    return send(res, 200, decorateOrder(order));
  }

  if (path[0] === "orders" && path[2] === "assign" && method === "POST") {
    const order = orders.find((item) => item.id === Number(path[1]));
    if (!order) {
      return notFound(res);
    }
    const courierId = Number(body.courier_id);
    order.assigned_courier_id = courierId;
    order.assigned_courier_name = courierName(courierId);
    order.batch_id = order.batch_id || 501;
    order.status = "ASSIGNED";
    order.assigned_at = new Date().toISOString();
    order.history.unshift({
      old_status: "NEW",
      new_status: "ASSIGNED",
      actor_tg_user_id: Number(actor.sub),
      note: "Назначен из Mini App",
      created_at: new Date().toISOString()
    });
    return send(res, 200, decorateOrder(order));
  }

  if (path[0] === "orders" && path[2] === "status" && method === "POST") {
    const order = orders.find((item) => item.id === Number(path[1]));
    if (!order) {
      return notFound(res);
    }
    const oldStatus = order.status;
    order.status = body.status;
    if (body.status === "PICKED_UP") {
      order.picked_up_at = new Date().toISOString();
    }
    if (body.status === "DELIVERED") {
      order.delivered_at = new Date().toISOString();
      order.proof_photo_file_id = body.proof_photo_file_id || order.proof_photo_file_id || "demo-proof";
      order.proof_comment = body.proof_comment || order.proof_comment || "Доставлено";
      order.duration_minutes = 32;
    }
    if (body.status === "PROBLEM") {
      order.problem_reason = body.reason || "Marked from Mini App";
    }
    if (body.status === "CANCELED") {
      order.canceled_reason = body.reason || "Canceled from Mini App";
    }
    order.history.unshift({
      old_status: oldStatus,
      new_status: body.status,
      actor_tg_user_id: Number(actor.sub),
      note: body.reason || null,
      created_at: new Date().toISOString()
    });
    return send(res, 200, decorateOrder(order));
  }

  if (path[0] === "couriers" && path.length === 1 && method === "GET") {
    if (actor.role !== "ADMIN") {
      return forbidden(res);
    }
    return send(res, 200, couriers);
  }

  if (path[0] === "couriers" && path[1] === "location" && method === "POST") {
    courierLocations[Number(actor.sub)] = {
      lat: Number(body.lat),
      lon: Number(body.lon),
      timestamp: new Date().toISOString(),
      map_url: `https://www.google.com/maps?q=${body.lat},${body.lon}`
    };
    return send(res, 200, { ok: true });
  }

  if (path[0] === "batches" && path[1] === "current" && method === "GET") {
    const actorId = Number(actor.sub);
    const route = orders
      .filter((item) => item.assigned_courier_id === actorId && STATUS_ACTIVE.has(item.status))
      .sort(byPriorityAndWindow)
      .map(decorateOrder);
    return send(res, 200, {
      batch_id: route.length ? 501 : null,
      status: route.length ? "ACTIVE" : null,
      completed: orders.filter((item) => item.assigned_courier_id === actorId && item.status === "DELIVERED")
        .length,
      remaining: route.length,
      total: orders.filter((item) => item.assigned_courier_id === actorId).length,
      next_order_id: route[0]?.id || null,
      orders: route
    });
  }

  if (path[0] === "analytics" && path[1] === "summary" && method === "GET") {
    if (actor.role !== "ADMIN") {
      return forbidden(res);
    }
    return send(res, 200, {
      summary:
        "Курьеры:\n100001: взято 2, выполнено 0, ср. 0 мин, проблемных 0%, просрочек 0%\n\nТочки выдачи:\n1: 2 заказа, ср. 0 мин\n2: 1 заказ, ср. 0 мин",
      couriers: [
        { courier_id: 100001, taken: 2, delivered: 0, avg_minutes: 0, problem_pct: 0, late_pct: 0 }
      ],
      pickup_points: [
        { pickup_point_id: 1, orders: 2, avg_minutes: 0 },
        { pickup_point_id: 2, orders: 1, avg_minutes: 0 }
      ]
    });
  }

  return notFound(res);
}
