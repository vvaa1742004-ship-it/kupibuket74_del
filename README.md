# Flower Courier Mini App

This folder is a standalone frontend project for Telegram Mini App deployment on Vercel.

## Deploy

1. Create a separate GitHub repository.
2. Upload the contents of this `webapp/` folder to that repository root.
3. In Vercel, import that repository.
4. Set environment variable:

```bash
VITE_API_BASE_URL=https://your-api-domain.example/api/v1
```

5. Build settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

## Important

- This is frontend only.
- The backend API must be deployed separately.
- Telegram Mini App auth still requires opening the app from the bot via `WebAppInfo`.
- For local browser-only checks, you can inject test `initData` through `window.__DEV_INIT_DATA__`.

