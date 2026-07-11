import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@ecommerce/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
    },
  },
  server: {
    port: 5173,
    host: "127.0.0.1",
    strictPort: false,
    proxy: {
      "/api": "http://127.0.0.1:3001",
      "/images": "http://127.0.0.1:3001",
    },
  },
});
