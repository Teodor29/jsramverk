import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: "/~teli21/editor",
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
});