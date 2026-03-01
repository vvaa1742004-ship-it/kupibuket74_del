import { useEffect, useMemo, useState } from "react";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import AppShell from "../components/AppShell";
import MapView from "../components/MapView";
import OrderCard from "../components/OrderCard";
import { fetchCurrentBatch, postCourierLocation, updateOrderStatus } from "../lib/api";
import type { BatchResponse, Order } from "../types";

export default function CourierDashboard() {
  const [batch, setBatch] = useState<BatchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setBatch(await fetchCurrentBatch());
    setLoading(false);
  };

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(interval);
  }, []);

  const nextOrder = batch?.orders[0];
  const progress = useMemo(() => {
    if (!batch || batch.total === 0) {
      return 0;
    }
    return Math.round((batch.completed / batch.total) * 100);
  }, [batch]);

  const sendGeolocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      void postCourierLocation(position.coords.latitude, position.coords.longitude).then(load);
    });
  };

  const performAction = async (order: Order, action: "PICKED_UP" | "DELIVERED" | "PROBLEM") => {
    await updateOrderStatus(order.id, { status: action });
    await load();
  };

  return (
    <AppShell title="Мой маршрут" subtitle="Текущий batch и следующий заказ" loading={loading}>
      <Box className="panel-card" sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            Прогресс
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary">
            Выполнено {batch?.completed ?? 0} из {batch?.total ?? 0}
          </Typography>
          <Button variant="contained" onClick={sendGeolocation}>
            Включить отслеживание
          </Button>
        </Stack>
      </Box>
      {nextOrder ? (
        <>
          <Typography variant="subtitle1" fontWeight={700}>
            Следующий заказ
          </Typography>
          <OrderCard
            order={nextOrder}
            actionLabel={
              nextOrder.status === "ASSIGNED"
                ? "Забрал"
                : nextOrder.status === "PICKED_UP"
                  ? "Доставлено"
                  : undefined
            }
            onAction={
              nextOrder.status === "ASSIGNED"
                ? () => void performAction(nextOrder, "PICKED_UP")
                : nextOrder.status === "PICKED_UP"
                  ? () => void performAction(nextOrder, "DELIVERED")
                  : undefined
            }
          />
        </>
      ) : (
        <Box className="panel-card empty-state">Активных заказов нет</Box>
      )}
      {batch?.orders.length ? (
        <MapView
          points={batch.orders
            .filter((order) => order.lat && order.lon)
            .map((order) => ({
              lat: order.lat as number,
              lon: order.lon as number,
              label: `${order.order_number}`
            }))}
        />
      ) : null}
      <Stack spacing={1.5}>
        {batch?.orders.map((order, index) => (
          <Box key={order.id}>
            <Typography variant="caption" color="text.secondary">
              Позиция {index + 1}
            </Typography>
            <OrderCard order={order} compact />
          </Box>
        ))}
      </Stack>
    </AppShell>
  );
}

