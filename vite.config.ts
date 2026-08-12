import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/open-source-fonts/',
  plugins: [react()],
});
