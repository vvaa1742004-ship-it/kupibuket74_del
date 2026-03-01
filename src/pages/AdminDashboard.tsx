import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import AppShell from "../components/AppShell";
import OrderCard from "../components/OrderCard";
import { fetchAnalytics, fetchCouriers, fetchOrders } from "../lib/api";
import type { Courier, Order, OrderPriority, OrderStatus } from "../types";

const statuses: OrderStatus[] = ["NEW", "ASSIGNED", "PICKED_UP", "PROBLEM", "DELIVERED", "CANCELED"];

export default function AdminDashboard() {
  const [status, setStatus] = useState<OrderStatus>("NEW");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<"" | OrderPriority>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [orderData, courierData, analytics] = await Promise.all([
        fetchOrders({ status, ...(search ? { query: search } : {}), ...(priority ? { priority } : {}) }),
        fetchCouriers(),
        fetchAnalytics()
      ]);
      setOrders(orderData);
      setCouriers(courierData);
      setSummary(analytics.summary);
      setLoading(false);
    };
    void load();
  }, [status, search, priority]);

  return (
    <AppShell title="Панель администратора" subtitle="Заказы, фильтры, аналитика" loading={loading}>
      <Box className="panel-card" sx={{ p: 1 }}>
        <Tabs
          value={status}
          onChange={(_, value) => setStatus(value)}
          variant="scrollable"
          scrollButtons={false}
        >
          {statuses.map((item) => (
            <Tab key={item} value={item} label={item} />
          ))}
        </Tabs>
      </Box>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          size="small"
          placeholder="Поиск по номеру, телефону, адресу"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          displayEmpty
          size="small"
          value={priority}
          onChange={(event) => setPriority(event.target.value as "" | OrderPriority)}
          sx={{ minWidth: 132 }}
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="VIP">VIP</MenuItem>
          <MenuItem value="URGENT">URGENT</MenuItem>
          <MenuItem value="NORMAL">NORMAL</MenuItem>
        </Select>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip label={`Курьеров: ${couriers.length}`} />
        <Chip label={`Заказов: ${orders.length}`} />
      </Stack>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
      {!orders.length ? <Box className="panel-card empty-state">Нет заказов по фильтру</Box> : null}
      <Box className="panel-card" sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Аналитика
        </Typography>
        <Typography whiteSpace="pre-line" variant="body2" color="text.secondary">
          {summary}
        </Typography>
      </Box>
    </AppShell>
  );
}

