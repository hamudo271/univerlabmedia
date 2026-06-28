import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// base: use "/univerlab/" for GitHub Pages, "/" for Railway/root-hosted.
// Set DEPLOY_TARGET=ghpages when running `npm run deploy`.
const base = process.env.DEPLOY_TARGET === "ghpages" ? "/univerlab/" : "/";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  server: {
    proxy: {
      // In dev, Vite runs on 5173 and Express on 3000. Forward API + uploads.
      "/api": { target: "http://localhost:3000", changeOrigin: true },
      "/uploads": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});
