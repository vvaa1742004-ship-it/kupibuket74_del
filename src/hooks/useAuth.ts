import { useEffect, useState } from "react";
import { authenticate, getApiBaseUrl, isDemoMode, setToken } from "../lib/api";
import { bootTelegramWebApp, getTelegramInitData } from "../lib/telegram";
import type { Actor } from "../types";

export function useAuth() {
  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bootTelegramWebApp();
    const token = localStorage.getItem("miniapp_token");
    if (token) {
      setToken(token);
    }

    const init = async () => {
      try {
        if (!isDemoMode() && !getApiBaseUrl()) {
          throw new Error(
            "Backend API is not configured. Set VITE_API_BASE_URL in Vercel and redeploy the frontend."
          );
        }
        const initData = getTelegramInitData();
        if (!initData) {
          throw new Error("Mini App must be opened from Telegram");
        }
        const response = await authenticate(initData);
        localStorage.setItem("miniapp_token", response.access_token);
        setToken(response.access_token);
        setActor(response.actor);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Auth failed";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  return { actor, loading, error };
}
