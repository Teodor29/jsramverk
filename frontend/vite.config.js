import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "/~teli21/editor/",
    plugins: [react(), tailwindcss()],
    server: {
        port: 3000,
        host: true,
    },
    test: {
        globals: true,
        environment: "jsdom",
        coverage: {
            reporter: ["text", "json", "html"],
            include: ["src/components/", "src/App.jsx"],
        },
    },
});