import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve, join } from "path"
import fs from "fs"
import tailwindcss from "@tailwindcss/vite"
// tsconfigPaths optional; using a targeted transform plugin instead

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "apollon-rewrite-internal-alias",
      enforce: "pre",
      transform(code, id) {
        const fsPrefix = "/@fs/"
        const libraryRoot = resolve(__dirname, "../../library")
        const absId = id.startsWith(fsPrefix) ? id.slice(fsPrefix.length) : id
        if (!absId.startsWith(libraryRoot)) return null
        const libraryLibRoot = resolve(libraryRoot, "lib")
        const resolveFile = (basePath: string): string => {
          try {
            const stat = fs.existsSync(basePath)
              ? fs.statSync(basePath)
              : undefined
            if (stat?.isFile()) return basePath
            if (stat?.isDirectory()) {
              const idxCandidates = [
                "index.tsx",
                "index.ts",
                "index.jsx",
                "index.js",
                "index.mjs",
                "index.cjs",
              ]
              for (const name of idxCandidates) {
                const p = join(basePath, name)
                if (fs.existsSync(p)) return p
              }
            }
            const extCandidates = [
              ".tsx",
              ".ts",
              ".jsx",
              ".js",
              ".mjs",
              ".cjs",
              ".css",
              ".json",
            ]
            for (const ext of extCandidates) {
              const p = `${basePath}${ext}`
              if (fs.existsSync(p) && fs.statSync(p).isFile()) return p
            }
          } catch {
            // ignore and fall through
          }
          return basePath // fall back; Vite may still resolve
        }

        const rewritten = code.replace(
          /(["'])@\/(.+?)\1/g,
          (_m: string, q: string, sub: string) => {
            const absBase = resolve(libraryLibRoot, sub)
            const resolvedFile = resolveFile(absBase)
            const target = `${fsPrefix}${resolvedFile}`
            return `${q}${target}${q}`
          }
        )
        return { code: rewritten, map: null }
      },
    },
  ],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") },
      { find: "assets", replacement: resolve(__dirname, "assets") },
      // Use local library build output entry file for reliable resolution
      {
        find: "@tumaet/apollon",
        replacement: resolve(__dirname, "../../library/lib"),
      },
    ],
    // Avoid duplicate React copies across workspace
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    fs: {
      // Allow serving files from the monorepo root and the library package
      allow: [
        resolve(__dirname, "..", ".."),
        resolve(__dirname, "..", "..", "library"),
      ],
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:4444",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ["@tumaet/apollon"],
  },
})
