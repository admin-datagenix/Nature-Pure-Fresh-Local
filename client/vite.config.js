import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    /** Listen on LAN — open http://<your-wifi-ip>:5173 from phone/other PC */
    host: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
