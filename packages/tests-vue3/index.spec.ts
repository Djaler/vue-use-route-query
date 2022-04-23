import { testUseRouteQuery } from 'tests-base';
import { beforeEach, it } from 'vitest';
import { createRouter, createWebHistory, Router } from 'vue-router';

import { mountComposition } from './vue-composition-test-utils';

let router: Router;

beforeEach(() => {
    router = createRouter({
        history: createWebHistory(),
        routes: [
            { path: '/', component: { template: '<div/>' } },
        ],
    });
});

testUseRouteQuery({
    replaceQuery: async (query) => {
        await router.replace({ query });
    },
    getCurrentQuery: () => router.currentRoute.value.query,
    mountComposition: callback => mountComposition(callback, {
        global: {
            plugins: [router],
        },
    }),
    it,
});
