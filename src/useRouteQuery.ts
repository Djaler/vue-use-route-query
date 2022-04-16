import { computed, Ref } from '@vue/composition-api';
import { AsyncQueue, createAsyncQueue } from 'async-queue-chain';
import type VueRouter from 'vue-router';
import type { Route } from 'vue-router';

import { useRoute, useRouter } from './helpers';
import { RouteQueryTransformer } from './transformers';
import { removeEmptyValues } from './utils';

export function useRouteQuery(key: string, defaultValue: string): Ref<string>;
export function useRouteQuery(key: string, defaultValue: string | null): Ref<string | null>;
export function useRouteQuery<T>(key: string, defaultValue: T, transformer: RouteQueryTransformer<T>): Ref<T>;
export function useRouteQuery<T>(key: string, defaultValue: T, transformer?: RouteQueryTransformer<T>): Ref<T> {
    const route = useRoute();
    const router = useRouter();

    function updateQueryParam(newValue: string | null | undefined) {
        queueQueryUpdate(router, route.value.query, key, newValue);
    }

    return computed({
        get() {
            if (!(key in route.value.query)) {
                return defaultValue;
            }

            const value = getQueryValue(route.value.query, key);

            if (!value) {
                return defaultValue;
            }

            if (!transformer) {
                // we know for sure that the value is a T (really a string) here if transformer is not provided
                return value as unknown as T;
            }

            const transformedValue = transformer.fromQuery(value);
            if (transformedValue === undefined) {
                return defaultValue;
            }

            return transformedValue;
        },
        set(value) {
            if (!transformer) {
                // we know for sure that the value is a string or null here if transformer is not provided
                updateQueryParam(value as unknown as string | null);
                return;
            }

            const transformedValue = transformer.toQuery(value ?? undefined);
            updateQueryParam(transformedValue);
        },
    });
}

function getQueryValue(query: Route['query'], key: string): string | null {
    const value = query[key];
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

let queryReplaceQueue: AsyncQueue<Route['query']> | undefined;

function queueQueryUpdate(router: VueRouter, currentQuery: Route['query'], key: string, newValue: string | null | undefined) {
    if (!queryReplaceQueue) {
        queryReplaceQueue = createAsyncQueue<Route['query']>();
    }

    queryReplaceQueue.add((previousQuery) => {
        const newQuery = {
            ...previousQuery,
            [key]: newValue,
        };

        return router.replace({
            query: removeEmptyValues(newQuery),
        })
            .then(newRoute => newRoute.query)
            .catch(() => previousQuery);
    });

    void queryReplaceQueue.run(currentQuery);
}
