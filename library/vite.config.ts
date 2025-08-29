import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { resolve } from "path"
import libInjectCss from "../plugins/lib_inject_css"

export default defineConfig({
  plugins: [react(), dts({ include: ["lib"] }), libInjectCss()],
  build: {
    copyPublicDir: false,
    lib: {
      name: "apollon2-library",
      entry: resolve(__dirname, "lib/index.tsx"),
      formats: ["es"],
    },
    // Do not externalize React: bundle everything so consumers don't need React installed
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "index.js",
      },
    },
    minify: true,
    commonjsOptions: {
      include: [/node_modules/],
      // No exclusions: allow bundling of all deps
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "lib"),
    },
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
  },
})
