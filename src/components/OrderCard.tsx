import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Order } from "../types";

const priorityColor = {
  VIP: "#d7263d",
  URGENT: "#f39237",
  NORMAL: "#7b8794"
};

interface OrderCardProps {
  order: Order;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export default function OrderCard({ order, actionLabel, onAction, compact }: OrderCardProps) {
  return (
    <Card elevation={0} className="panel-card">
      <CardContent>
        <Stack spacing={1.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={700}>#{order.order_number}</Typography>
            <Chip
              size="small"
              label={order.priority_label}
              sx={{
                color: "white",
                backgroundColor: priorityColor[order.priority]
              }}
            />
          </Stack>
          <Typography>{order.address_text}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(order.delivery_window_start).toLocaleString()} -{" "}
            {new Date(order.delivery_window_end).toLocaleTimeString()}
          </Typography>
          {!compact ? (
            <Typography variant="body2" color="text.secondary">
              {order.comment || "Без комментария"}
            </Typography>
          ) : null}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip size="small" label={order.status} variant="outlined" />
            <Chip size="small" label={`ETA ${order.eta_minutes ?? "-"} мин`} variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to={`/orders/${order.id}`} variant="outlined" fullWidth>
              Открыть
            </Button>
            {actionLabel && onAction ? (
              <Button onClick={onAction} variant="contained" fullWidth>
                {actionLabel}
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

