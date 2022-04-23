import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@vue/composition-api': '@vue/composition-api/dist/vue-composition-api.common.js',
        },
    },
    test: {
        environment: 'jsdom',
    },
});
