import VueCompositionApi from '@vue/composition-api';
import { testUseRouteQuery } from 'test-base';
import { beforeEach } from 'vitest';
import Vue from 'vue';
import VueRouter from 'vue-router';

import { mountComposition } from './vue-composition-test-utils';

Vue.use(VueRouter);
Vue.use(VueCompositionApi);

let router: VueRouter;

beforeEach(() => {
    router = new VueRouter();
});

testUseRouteQuery({
    replaceQuery: async (query) => {
        await router.replace({ query });
    },
    getCurrentQuery: () => router.currentRoute.query,
    mountComposition: callback => mountComposition(callback, {
        router,
    }),
});
