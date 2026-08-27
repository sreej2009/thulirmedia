import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Only the production build (served from github.io/thulirmedia/) needs a
  // base path — leaving dev at '/' keeps `npm run dev` unchanged.
  base: command === 'build' ? '/thulirmedia/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    // three/R3F/postprocessing are already isolated into their own cacheable
    // vendor chunk below; raising this just silences the size warning for
    // that expected, unavoidable bundle rather than fragmenting it further.
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three'
            if (id.includes('@react-three')) return 'r3f'
            if (id.includes('gsap')) return 'gsap'
          }
        },
      },
    },
  },
}))
