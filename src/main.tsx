import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import App from "./App";
import "./styles.css";

console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL, "DEMO:", import.meta.env.VITE_DEMO_MODE);

const theme = createTheme({
  palette: {
    primary: { main: "#183153" },
    secondary: { main: "#d95d39" },
    background: { default: "#f5f1e8", paper: "#fffdf8" }
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
