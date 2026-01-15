import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // any request starting with /api will be forwarded to your backend
      "/api": {
        target: "https://localhost:7002",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
