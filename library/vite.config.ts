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
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "index.js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    minify: true,
    commonjsOptions: {
      include: [/node_modules/],
      exclude: ["react", "react-dom"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "lib"),
    },
    dedupe: ["@emotion/react", "@emotion/styled"],
  },
})
