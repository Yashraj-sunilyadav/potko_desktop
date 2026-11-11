import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const projectRoot = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@nodedr-restaurant/types": path.resolve(projectRoot, "packages/types/src/index.ts"), "@": projectRoot } },
  build: { sourcemap: true },
});
