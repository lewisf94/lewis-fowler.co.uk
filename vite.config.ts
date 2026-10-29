import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is served from the root of lewis-fowler.co.uk, so base stays "/".
export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist", sourcemap: true, chunkSizeWarningLimit: 700 },
});
