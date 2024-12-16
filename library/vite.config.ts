import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "lib/index.ts",
      name: "@apollon2/library",
      fileName: (format) => `@apollon2/library.${format}.js`,
    },
  },
});
