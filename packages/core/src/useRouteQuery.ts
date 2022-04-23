import { computed, Ref } from 'vue-demi';

import { useRoute, useRouter } from './helpers';
import { queueQueryUpdate } from './queue-query-update';
import { RouteQueryTransformer } from './transformers';
import { RouteQuery } from './types';

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

function getQueryValue(query: RouteQuery, key: string): string | null | undefined {
    const value = query[key];
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}
