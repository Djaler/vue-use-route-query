import { testUseRouteQuery } from 'tests-base';
import { beforeEach, it } from 'vitest';
import Vue from 'vue';
import VueRouter from 'vue-router';

import { mountComposition } from './vue-composition-test-utils';

Vue.use(VueRouter);

let router: VueRouter;

beforeEach(() => {
    router = new VueRouter();
});

testUseRouteQuery({
    replaceQuery: async (query) => {
        await router.replace({ query });
    },
    getCurrentQuery: () => router.currentRoute.query,
    back: () => router.back(),
    waitForRouteChange: () => new Promise((resolve) => {
        const unwatch = router.afterEach(() => {
            resolve();
            unwatch();
        });
    }),
    mountComposition: callback => mountComposition(callback, {
        router,
    }),
    it,
});
