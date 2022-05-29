import { computed, Ref } from 'vue-demi';

import { useRoute, useRouter } from './helpers';
import { queueQueryUpdate } from './queue-query-update';
import { RouteQueryArrayTransformer, RouteQueryTransformer } from './transformers';
import { isNotNull } from './utils';

type TransformerFor<T> = T extends unknown[] ? RouteQueryArrayTransformer<T> : RouteQueryTransformer<T>;

export function useRouteQuery(key: string, defaultValue: string): Ref<string>;
export function useRouteQuery(key: string, defaultValue: string | null): Ref<string | null>;
export function useRouteQuery<T extends unknown[]>(
    key: string, defaultValue: T, transformer: RouteQueryArrayTransformer<T>,
): Ref<T>;
export function useRouteQuery<T>(key: string, defaultValue: T, transformer: RouteQueryTransformer<T>): Ref<T>;
export function useRouteQuery<T>(
    key: string,
    defaultValue: T,
    transformer?: TransformerFor<T>,
): Ref<T> {
    const route = useRoute();
    const router = useRouter();

    function updateQueryParam(newValue: string | string[] | null | undefined) {
        queueQueryUpdate(router, route.value.query, key, newValue);
    }

    return computed({
        get() {
            if (!(key in route.value.query)) {
                return defaultValue;
            }

            const value = route.value.query[key];

            if (!value) {
                return defaultValue;
            }

            if (!transformer) {
                // we know for sure that the value is a T (really a string) here if transformer is not provided
                return (Array.isArray(value) ? value[0] : value) as unknown as T;
            }

            const transformedValue = Array.isArray(value)
                ? transformQueryArray(value, transformer)
                : transformQuery(value, transformer);

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

            const transformedValue = isRouteQueryArrayTransformer(transformer)
                ? transformer.toQueryArray(value ?? undefined)
                : transformer.toQuery(value ?? undefined);

            updateQueryParam(transformedValue);
        },
    });
}

function transformQueryArray<T>(
    value: Array<string | null>,
    transformer: TransformerFor<T>,
): T | undefined {
    if (isRouteQueryArrayTransformer(transformer)) {
        return transformer.fromQueryArray(value.filter(isNotNull));
    }

    if (value[0] === null) {
        return undefined;
    }

    return transformer.fromQuery(value[0]);
}

function transformQuery<T>(
    value: string,
    transformer: TransformerFor<T>,
): T | undefined {
    if (isRouteQueryArrayTransformer(transformer)) {
        return transformer.fromQueryArray([value]);
    }

    return transformer.fromQuery(value);
}

function isRouteQueryArrayTransformer(
    transformer: RouteQueryTransformer<any> | RouteQueryArrayTransformer<any>,
): transformer is RouteQueryArrayTransformer<any> {
    return 'fromQueryArray' in transformer && 'toQueryArray' in transformer;
}
