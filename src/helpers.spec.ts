import { describe, expect, it } from 'vitest';
import VueRouter from 'vue-router';

import { mountComposition } from '../tests/vue-composition-test-utils';
import { useRoute, useRouter } from './helpers';

describe('useRouter', () => {
    it('should return router instance', () => {
        const router = new VueRouter();

        const { result } = mountComposition(useRouter, {
            router,
        });

        expect(result).toBe(router);
    });

    it('should throw exception if called not in setup', () => {
        const fn = () => useRouter();

        expect(fn).toThrow('Not found vue instance.');
    });
});

describe('useRoute', () => {
    it('should return ref to current route', () => {
        const router = new VueRouter();

        const { result } = mountComposition(useRoute, {
            router,
        });

        expect(result.value).toBe(router.currentRoute);
    });

    it('should update ref when route changes', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/foo' },
                { path: '/bar' },
            ],
        });

        const { result } = mountComposition(useRoute, {
            router,
        });

        await router.push('/bar');

        expect(result.value.path).toBe('/bar');
    });

    it('should throw exception if called not in setup', () => {
        const fn = () => useRoute();

        expect(fn).toThrow('Not found vue instance.');
    });
});
