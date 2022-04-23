import VueCompositionApi from '@vue/composition-api';
import { setImmediate } from 'timers';
import { beforeEach, expect, it } from 'vitest';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { RouteQueryTransformer, useRouteQuery } from 'vue-use-route-query/src';

import { mountComposition } from './vue-composition-test-utils';

Vue.use(VueRouter);
Vue.use(VueCompositionApi);

let router: VueRouter;

beforeEach(() => {
    router = new VueRouter();
});

it('should return string param if present', async () => {
    await router.replace({
        query: {
            foo: 'bar',
        },
    });

    const { result } = mountComposition(() => useRouteQuery('foo', null), {
        router,
    });

    expect(result.value).toBe('bar');
});

it('should return default value if param is absent', async () => {
    await router.replace({
        query: {},
    });

    const { result } = mountComposition(() => useRouteQuery('foo', 'bar'), {
        router,
    });

    expect(result.value).toBe('bar');
});

it('should return transformed value if param is present', async () => {
    await router.replace({
        query: {
            foo: 'bar',
        },
    });
    const transformer: RouteQueryTransformer<string> = {
        fromQuery(value) {
            return value.toUpperCase();
        },
        toQuery(value) {
            return value?.toLowerCase();
        },
    };

    const { result } = mountComposition(() => useRouteQuery('foo', null, transformer), {
        router,
    });

    expect(result.value).toBe('BAR');
});

it('should return default value if transformed value is absent', async () => {
    await router.replace({
        query: {},
    });
    const transformer: RouteQueryTransformer<string> = {
        fromQuery() {
            return undefined;
        },
        toQuery() {
            return undefined;
        },
    };

    const { result } = mountComposition(() => useRouteQuery('foo', 'bar', transformer), {
        router,
    });

    expect(result.value).toBe('bar');
});

it('should update query when value set', () => {
    const { result } = mountComposition(() => useRouteQuery('foo', null), {
        router,
    });

    result.value = 'bar';

    expect(router.currentRoute.query.foo).toBe('bar');
});

it('should update query when value set with transformer', () => {
    const transformer: RouteQueryTransformer<string> = {
        fromQuery(value) {
            return value.toUpperCase();
        },
        toQuery(value) {
            return value?.toLowerCase();
        },
    };
    const { result } = mountComposition(() => useRouteQuery('foo', null, transformer), {
        router,
    });

    result.value = 'BAR';

    expect(router.currentRoute.query.foo).toBe('bar');
});

it('should update query when value cleared', async () => {
    await router.replace({
        query: {
            foo: 'bar',
        },
    });
    const { result } = mountComposition(() => useRouteQuery('foo', null), {
        router,
    });

    result.value = null;

    expect(router.currentRoute.query.foo).toBe(undefined);
});

it('should update query after several changes', async () => {
    const { result } = mountComposition(() => ({
        foo: useRouteQuery('foo', null),
        bar: useRouteQuery('bar', null),
    }), {
        router,
    });

    const foo = result.foo;
    const bar = result.bar;
    foo.value = 'FOO';
    bar.value = 'BAR';

    await flushPromises();

    expect(router.currentRoute.query.foo).toBe('FOO');
    expect(router.currentRoute.query.bar).toBe('BAR');
});

function flushPromises(): Promise<void> {
    return new Promise((resolve) => {
        setImmediate(resolve);
    });
}
