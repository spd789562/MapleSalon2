import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import solid from 'vite-plugin-solid';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [solid(), glsl()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'styled-system': path.resolve(__dirname, 'styled-system'),
      'lucide-solid/icons': fileURLToPath(
        new URL(
          './node_modules/lucide-solid/dist/source/icons',
          import.meta.url,
        ),
      ),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}));
