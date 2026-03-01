declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        ready: () => void;
        expand: () => void;
        colorScheme?: string;
      };
    };
    __DEV_INIT_DATA__?: string;
  }
}

export function getTelegramInitData(): string {
  return window.Telegram?.WebApp?.initData || window.__DEV_INIT_DATA__ || "";
}

export function bootTelegramWebApp(): void {
  window.Telegram?.WebApp?.ready();
  window.Telegram?.WebApp?.expand();
}

