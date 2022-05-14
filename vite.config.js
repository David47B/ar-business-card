import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        chunkSizeWarningLimit: 5000,
        cssCodeSplit: false,
        manifest: true
    },
    base: ''
})