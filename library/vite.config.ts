import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['lib'] }),
    // eslint-disable-next-line
    visualizer({ open: false, filename: 'stats.html' }) as any,
  ],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'lib/components'),
      '@utils': resolve(__dirname, 'lib/utils'),
      '@types': resolve(__dirname, 'lib/types'),
      '@hooks': resolve(__dirname, 'lib/hooks'),
      '@nodes': resolve(__dirname, 'lib/nodes'),
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
    minify: true,
  },
});
