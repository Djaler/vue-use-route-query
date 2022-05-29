import { isNotUndefined } from './utils';

export interface RouteQueryTransformer<T> {
    fromQuery(value: string): T | undefined;

    toQuery(value: T | undefined): string | undefined;
}

export const stringTransformer: RouteQueryTransformer<string> = {
    fromQuery(value: string): string | undefined {
        return value || undefined;
    },
    toQuery(value: string | undefined): string | undefined {
        return value;
    },
};

export const integerTransformer: RouteQueryTransformer<number> = {
    fromQuery(value) {
        const numberValue = Number.parseInt(value, 10);
        if (!Number.isInteger(numberValue)) {
            return undefined;
        }

        return numberValue;
    },
    toQuery(value) {
        return value?.toString();
    },
};

export const floatTransformer: RouteQueryTransformer<number> = {
    fromQuery(value) {
        const numberValue = Number.parseFloat(value);
        if (Number.isNaN(numberValue)) {
            return undefined;
        }

        return numberValue;
    },
    toQuery(value) {
        return value?.toString();
    },
};

export const booleanTransformer: RouteQueryTransformer<boolean> = {
    fromQuery(value) {
        if (value === 'true') {
            return true;
        }

        if (value === 'false') {
            return false;
        }

        return undefined;
    },
    toQuery(value) {
        return value?.toString();
    },
};

type EnumLike<T> = Record<keyof T, number> | Record<keyof T, string>;

export function enumTransformer<T extends EnumLike<T>>(enumObject: T): RouteQueryTransformer<T[keyof T]> {
    return {
        fromQuery(key) {
            return enumObject[key as keyof T];
        },
        toQuery(value) {
            const entry = Object.entries(enumObject)
                .find(([, val]) => val === value);

            return entry ? entry[0] : undefined;
        },
    };
}

export interface RouteQueryArrayTransformer<T extends unknown[]> {
    fromQueryArray(value: string[]): T | undefined;

    toQueryArray(value: T | undefined): string[] | undefined;
}

export function arrayTransformer<T>(transformer: RouteQueryTransformer<T>): RouteQueryArrayTransformer<T[]> {
    return {
        fromQueryArray(value) {
            return value.map(item => transformer.fromQuery(item)).filter(isNotUndefined);
        },
        toQueryArray(value) {
            return value?.map(item => transformer.toQuery(item)).filter(isNotUndefined);
        },
    };
}
