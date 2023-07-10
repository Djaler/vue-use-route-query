import { computed, reactive, Ref, watch } from 'vue-demi';

import { useRoute, useRouter } from './helpers';
import { queueQueryUpdate } from './queue-query-update';
import { RouteQueryTransformer } from './transformers';
import { NavigationMode, RouteQuery } from './types';
import { isObject } from './utils';

interface Options {
    mode?: NavigationMode;
}

type TransformerOrOptions<T> = RouteQueryTransformer<T> | Options;

export function useRouteQuery(key: string, defaultValue: string, options?: Options): Ref<string>;
export function useRouteQuery(key: string, defaultValue: string | null, options?: Options): Ref<string | null>;
export function useRouteQuery<T>(
    key: string,
    defaultValue: T,
    transformer: RouteQueryTransformer<T>,
    options?: Options,
): Ref<T>;
export function useRouteQuery<T>(
    key: string,
    defaultValue: T,
    transformerOrOptions?: TransformerOrOptions<T>,
    optionsParam?: Options,
): Ref<T> {
    const route = useRoute();
    const router = useRouter();

    const [transformer, options] = extractTransformerAndOptions(transformerOrOptions, optionsParam);
    const navigationMode = options?.mode || 'replace';

    function updateQueryParam(newValue: string | null | undefined) {
        queueQueryUpdate(router, route.value.query, key, newValue, navigationMode);
    }

    function get(): T {
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
    }

    function set(value: T) {
        if (!transformer) {
            // we know for sure that the value is a string or null here if transformer is not provided
            updateQueryParam(value as unknown as string | null);
            return;
        }

        const transformedValue = transformer.toQuery(value ?? undefined);
        updateQueryParam(transformedValue);
    }

    let valueWatchStopHandle: (() => void) | undefined;

    return computed({
        get() {
            const value = get();
            if (isObject(value)) {
                const reactiveValue = reactive(value) as T & object;
                valueWatchStopHandle?.();
                valueWatchStopHandle = watch(reactiveValue, (newValue) => {
                    set(newValue);
                });
                return reactiveValue;
            }
            return value;
        },
        set(value) {
            valueWatchStopHandle?.();

            set(value);
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

function extractTransformerAndOptions<T>(
    transformerOrOptions?: TransformerOrOptions<T>,
    options?: Options,
): [RouteQueryTransformer<T> | undefined, Options | undefined] {
    return isTransformer(transformerOrOptions)
        ? [transformerOrOptions, options]
        : [undefined, transformerOrOptions || options];
}

function isTransformer<T>(
    transformerOrOptions?: TransformerOrOptions<T>,
): transformerOrOptions is RouteQueryTransformer<T> {
    return !!transformerOrOptions
        && 'fromQuery' in transformerOrOptions
        && 'toQuery' in transformerOrOptions;
}
