import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import packageJson from './package.json';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                switch (format) {
                    case 'es':
                        return 'index.mjs';
                    case 'cjs':
                        return 'index.js';
                    default:
                        throw new Error(`Unexpected format: ${format}`);
                }
            },
        },
        rollupOptions: {
            external: [
                ...Object.keys(packageJson.dependencies),
                ...Object.keys(packageJson.peerDependencies),
            ],
        },
        target: 'es2017',
        minify: false,
    },
    plugins: [
        dts(),
    ],
    test: {
        environment: 'jsdom',
        setupFiles: [
            'tests/setup.ts',
        ],
    },
});
