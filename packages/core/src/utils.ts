export function removeEmptyValues<T extends Record<string, any>>(object: T): T {
    return Object.fromEntries(
        Object.entries(object)
            .filter(([, value]) => !isEmpty(value)),
    ) as T;
}

function isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
}

export function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}

export function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}
