import { Alert, Button, Stack } from "@mui/material";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import { useAuth } from "./hooks/useAuth";
import AdminDashboard from "./pages/AdminDashboard";
import CourierDashboard from "./pages/CourierDashboard";
import OrderPage from "./pages/OrderPage";

export default function App() {
  const { actor, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <AppShell title="Загрузка Mini App" loading />;
  }

  if (error || !actor) {
    return (
      <AppShell title="Ошибка доступа">
        <Alert severity="error">{error || "Авторизация не выполнена"}</Alert>
      </AppShell>
    );
  }

  const targetHome = actor.role === "ADMIN" ? "/admin" : "/courier";
  if (location.pathname === "/") {
    return <Navigate to={targetHome} replace />;
  }

  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/courier" element={<CourierDashboard />} />
      <Route path="/orders/:orderId" element={<OrderPage />} />
      <Route
        path="*"
        element={
          <AppShell title="Раздел не найден">
            <Stack spacing={2}>
              <Alert severity="warning">Неизвестный маршрут Mini App</Alert>
              <Button variant="contained" onClick={() => navigate(targetHome)}>
                На главную
              </Button>
            </Stack>
          </AppShell>
        }
      />
    </Routes>
  );
}

