import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// https://vite-pwa-org.netlify.app/assets-generator/
// https://vite-pwa-org.netlify.app/guide/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*"],
      },
      manifest: {
        scope: "/",
        start_url: "/",
        name: "Axios",
        short_name: "Axios",
        description: "Axios Event Management App",
        theme_color: "#171717",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
