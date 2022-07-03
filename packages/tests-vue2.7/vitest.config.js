import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            vue: 'vue/dist/vue.runtime.common.js',
            'vue-demi': 'vue-demi/lib/index.cjs',
        },
    },
    test: {
        environment: 'jsdom',
    },
});
