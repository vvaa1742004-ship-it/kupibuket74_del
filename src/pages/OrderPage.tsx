import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import MapView from "../components/MapView";
import { assignOrder, fetchCouriers, fetchOrder, patchOrder, updateOrderStatus } from "../lib/api";
import type { Courier, Order } from "../types";

export default function OrderPage() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [orderData, courierData] = await Promise.all([fetchOrder(orderId), fetchCouriers().catch(() => [])]);
    setOrder(orderData);
    setComment(orderData.comment || "");
    setCouriers(courierData);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [orderId]);

  const mapPoints = useMemo(() => {
    if (!order?.lat || !order?.lon) {
      return [];
    }
    const points = [{ lat: order.lat, lon: order.lon, label: `Заказ ${order.order_number}` }];
    if (order.courier_location) {
      points.unshift({
        lat: order.courier_location.lat,
        lon: order.courier_location.lon,
        label: "Курьер"
      });
    }
    return points;
  }, [order]);

  if (!orderId) {
    return null;
  }

  return (
    <AppShell title={`Заказ #${order?.order_number || orderId}`} loading={loading}>
      {order ? (
        <>
          <Box className="panel-card" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography fontWeight={700}>{order.priority_label}</Typography>
              <Typography>{order.address_text}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.customer_phone} / {order.recipient_phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Курьер: {order.assigned_courier_name || "Не назначен"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ETA: {order.eta_minutes ?? "-"} мин
              </Typography>
              {order.courier_distance_km ? (
                <Typography variant="body2" color="text.secondary">
                  До заказа: {order.courier_distance_km} км
                </Typography>
              ) : null}
            </Stack>
          </Box>

          <Box className="panel-card" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Select
                size="small"
                value={order.assigned_courier_id || ""}
                onChange={async (event) => {
                  const courierId = Number(event.target.value);
                  await assignOrder(order.id, courierId);
                  await load();
                }}
              >
                <MenuItem value="">Назначить курьера</MenuItem>
                {couriers.map((courier) => (
                  <MenuItem key={courier.tg_user_id} value={courier.tg_user_id}>
                    {courier.full_name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                multiline
                minRows={3}
                size="small"
                label="Комментарий"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <Button
                variant="outlined"
                onClick={async () => {
                  await patchOrder(order.id, { comment });
                  await load();
                }}
              >
                Сохранить
              </Button>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button variant="contained" onClick={async () => { await updateOrderStatus(order.id, { status: "PICKED_UP" }); await load(); }}>
                  PICKED_UP
                </Button>
                <Button variant="contained" color="success" onClick={async () => { await updateOrderStatus(order.id, { status: "DELIVERED" }); await load(); }}>
                  DELIVERED
                </Button>
                <Button variant="contained" color="warning" onClick={async () => { await updateOrderStatus(order.id, { status: "PROBLEM", reason: "Marked from Mini App" }); await load(); }}>
                  PROBLEM
                </Button>
                <Button variant="contained" color="error" onClick={async () => { await updateOrderStatus(order.id, { status: "CANCELED", reason: "Canceled from Mini App" }); await load(); }}>
                  CANCELED
                </Button>
              </Stack>
            </Stack>
          </Box>

          <MapView points={mapPoints} />

          <Box className="panel-card" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              История статусов
            </Typography>
            <Stack divider={<Divider flexItem />} spacing={1}>
              {order.history.map((item, index) => (
                <Box key={`${item.created_at}-${index}`} sx={{ pt: 1 }}>
                  <Typography fontWeight={600}>{item.new_status}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.created_at).toLocaleString()} | actor {item.actor_tg_user_id}
                  </Typography>
                  {item.note ? (
                    <Typography variant="body2" color="text.secondary">
                      {item.note}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Box>

          <Button variant="text" onClick={() => navigate(-1)}>
            Назад
          </Button>
        </>
      ) : null}
    </AppShell>
  );
}

