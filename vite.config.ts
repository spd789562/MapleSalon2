import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import solid from 'vite-plugin-solid';
import glsl from 'vite-plugin-glsl';
import solidSvg from 'vite-plugin-solid-svg';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    solid(),
    glsl(),
    solidSvg({
      defaultAsComponent: true,
      svgo: {
        enabled: true,
        svgoConfig: {
          plugins: [
            {
              name: 'convertColors',
              params: {
                currentColor: true,
              },
            },
            'removeDimensions',
            // 'preset-default',
          ],
        },
      },
    }),
  ],

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

  /* target es2022 to fix esbuild "top level await" feature */
  build: {
    target: "es2022"
  },
  esbuild: {
    target: "es2022"
  },
  /* fix wasm-webp's wasm not been include */
  optimizeDeps: {
    exclude: ['wasm-webp'],
    esbuildOptions: {
      target: "es2022",
    }
  },
  assetsInclude: ['**/wasm-webp/**/*.wasm'],

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
