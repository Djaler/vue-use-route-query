import { setImmediate } from 'timers';
import { expect, TestAPI } from 'vitest';
import { RouteQueryTransformer, useRouteQuery, waitForQueryUpdate } from 'vue-use-route-query/src';
import { RouteQuery } from 'vue-use-route-query/src/types';

interface MountResult<R> {
    result: R;
    error: unknown;
}

interface Params {
    replaceQuery: (query: RouteQuery) => Promise<void>;
    mountComposition: <R>(callback: () => R) => MountResult<R>;
    getCurrentQuery: () => RouteQuery;
    waitForRouteChange: () => Promise<void>;
    back: () => void;
    it: TestAPI;
}

export function testUseRouteQuery(
    {
        replaceQuery, mountComposition, getCurrentQuery, it, back, waitForRouteChange,
    }: Params,
) {
    it('should return string param if present', async () => {
        await replaceQuery({
            foo: 'bar',
        });

        const { result } = mountComposition(() => useRouteQuery('foo', null));

        expect(result.value).toBe('bar');
    });

    it('should return default value if param is absent', async () => {
        await replaceQuery({});

        const { result } = mountComposition(() => useRouteQuery('foo', 'bar'));

        expect(result.value).toBe('bar');
    });

    it('should return transformed value if param is present', async () => {
        await replaceQuery({
            foo: 'bar',
        });
        const transformer: RouteQueryTransformer<string> = {
            fromQuery(value) {
                return value.toUpperCase();
            },
            toQuery(value) {
                return value?.toLowerCase();
            },
        };

        const { result } = mountComposition(() => useRouteQuery('foo', null, transformer));

        expect(result.value).toBe('BAR');
    });

    it('should return default value if transformed value is absent', async () => {
        await replaceQuery({});
        const transformer: RouteQueryTransformer<string> = {
            fromQuery() {
                return undefined;
            },
            toQuery() {
                return undefined;
            },
        };

        const { result } = mountComposition(() => useRouteQuery('foo', 'bar', transformer));

        expect(result.value).toBe('bar');
    });

    it('should update query when value set', async () => {
        const { result } = mountComposition(() => useRouteQuery('foo', null));

        result.value = 'bar';
        await flushPromises();

        expect(getCurrentQuery().foo).toBe('bar');
    });

    it('should update query using push when value set', async () => {
        const { result } = mountComposition(() => useRouteQuery('foo', null, {
            mode: 'push',
        }));

        result.value = 'bar';
        result.value = 'baz';
        await flushPromises();

        expect(getCurrentQuery().foo).toBe('baz');
        back();
        await waitForRouteChange();
        expect(getCurrentQuery().foo).toBe('bar');
    });

    it('should update query when value set with transformer', async () => {
        const transformer: RouteQueryTransformer<string> = {
            fromQuery(value) {
                return value.toUpperCase();
            },
            toQuery(value) {
                return value?.toLowerCase();
            },
        };
        const { result } = mountComposition(() => useRouteQuery('foo', null, transformer));

        result.value = 'BAR';
        await flushPromises();

        expect(getCurrentQuery().foo).toBe('bar');
    });

    it('should update query using push when value set with transformer', async () => {
        const transformer: RouteQueryTransformer<string> = {
            fromQuery(value) {
                return value.toUpperCase();
            },
            toQuery(value) {
                return value?.toLowerCase();
            },
        };
        const { result } = mountComposition(() => useRouteQuery('foo', null, transformer, {
            mode: 'push',
        }));

        result.value = 'BAR';
        result.value = 'BAZ';
        await flushPromises();

        expect(getCurrentQuery().foo).toBe('baz');
        back();
        await waitForRouteChange();
        expect(getCurrentQuery().foo).toBe('bar');
    });

    it('should update query when value cleared', async () => {
        await replaceQuery({
            foo: 'bar',
        });
        const { result } = mountComposition(() => useRouteQuery('foo', null));

        result.value = null;
        await flushPromises();

        expect(getCurrentQuery().foo).toBe(undefined);
    });

    it('should update query after several changes', async () => {
        const { result } = mountComposition(() => ({
            foo: useRouteQuery('foo', null),
            bar: useRouteQuery('bar', null),
        }));

        const foo = result.foo;
        const bar = result.bar;
        foo.value = 'FOO';
        await flushPromises();
        bar.value = 'BAR';
        await flushPromises();

        const query = getCurrentQuery();
        expect(query.foo).toBe('FOO');
        expect(query.bar).toBe('BAR');
    });

    it('should update query after several simultaneous changes', async () => {
        const { result } = mountComposition(() => ({
            foo: useRouteQuery('foo', null),
            bar: useRouteQuery('bar', null),
        }));

        const foo = result.foo;
        const bar = result.bar;
        foo.value = 'FOO';
        bar.value = 'BAR';
        await flushPromises();

        const query = getCurrentQuery();
        expect(query.foo).toBe('FOO');
        expect(query.bar).toBe('BAR');
    });

    it('should update query after changes in returned array', async () => {
        const transformer: RouteQueryTransformer<string[]> = {
            fromQuery(value: string): string[] | undefined {
                return value?.split(',');
            },
            toQuery(value: string[] | undefined): string | undefined {
                return value?.join(',');
            },
        };

        const { result } = mountComposition(() => useRouteQuery('array', [], transformer));

        result.value.push('foo');
        result.value.push('bar');
        await flushPromises();

        expect(getCurrentQuery().array).toBe('foo,bar');

        result.value = ['baz'];
        await flushPromises();

        expect(getCurrentQuery().array).toBe('baz');
    });

    it('should not react on returned array changes if it was reassigned', async () => {
        const transformer: RouteQueryTransformer<string[]> = {
            fromQuery(value: string): string[] | undefined {
                return value?.split(',');
            },
            toQuery(value: string[] | undefined): string | undefined {
                return value?.join(',');
            },
        };

        const { result } = mountComposition(() => useRouteQuery('array', [], transformer));

        const array = result.value;
        result.value = ['foo', 'bar'];
        array.push('baz');
        await flushPromises();

        expect(getCurrentQuery().array).toBe('foo,bar');
    });

    it('should allow to wait for query update', async () => {
        const { result } = mountComposition(() => useRouteQuery('foo', null));

        result.value = 'bar';
        await waitForQueryUpdate();

        expect(getCurrentQuery().foo).toBe('bar');
    });
}

function flushPromises(): Promise<void> {
    return new Promise((resolve) => {
        setImmediate(resolve);
    });
}
