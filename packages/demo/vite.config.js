import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/vue-use-route-query/',
    plugins: [
        vue(),
    ],
    optimizeDeps: {
        exclude: [
            'vue-demi',
        ],
    },
});
