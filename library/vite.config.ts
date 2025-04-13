import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["lib"] })
    // Removed libInjectCss(), now using rollup-plugin-postcss instead
  ],
  build: {
    copyPublicDir: false,
    lib: {
      name: "apollon2-library",
      entry: resolve(__dirname, "lib/index.tsx"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "index.js",
      },
      plugins: [
        // Configure postcss to inject CSS into the bundle:
        postcss({
          inject: true,   // Inject CSS into JavaScript
          extract: false, // Do not output a separate CSS file
          minimize: true, // Optionally minimize the CSS
        }),
      ],
    },
    minify: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "lib"),
    },
  },
});
