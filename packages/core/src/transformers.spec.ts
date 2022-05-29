import { beforeEach, describe, expect, it, vi, vitest } from 'vitest';

import {
    arrayTransformer,
    booleanTransformer,
    enumTransformer,
    floatTransformer,
    integerTransformer, RouteQueryTransformer,
} from './transformers';

describe('integerTransformer', () => {
    const transformer = integerTransformer;

    describe('fromQuery', () => {
        it('should return integer value by string', () => {
            expect(transformer.fromQuery('1')).toEqual(1);
        });

        it('should return undefined if not integer string provided', () => {
            expect(transformer.fromQuery('D')).toBeUndefined();
        });
    });

    describe('toQuery', () => {
        it('should return string by integer value', () => {
            expect(transformer.toQuery(1)).toEqual('1');
        });

        it('should return undefined if undefined provided', () => {
            expect(transformer.toQuery(undefined)).toBeUndefined();
        });
    });
});

describe('floatTransformer', () => {
    const transformer = floatTransformer;

    describe('fromQuery', () => {
        it('should return float value by string', () => {
            expect(transformer.fromQuery('1.1')).toEqual(1.1);
        });

        it('should return undefined if not float string provided', () => {
            expect(transformer.fromQuery('D')).toBeUndefined();
        });
    });

    describe('toQuery', () => {
        it('should return string by float value', () => {
            expect(transformer.toQuery(1.1)).toEqual('1.1');
        });

        it('should return undefined if undefined provided', () => {
            expect(transformer.toQuery(undefined)).toBeUndefined();
        });
    });
});

describe('booleanTransformer', () => {
    const transformer = booleanTransformer;

    describe('fromQuery', () => {
        it('should return boolean value by string', () => {
            expect(transformer.fromQuery('true')).toEqual(true);
            expect(transformer.fromQuery('false')).toEqual(false);
        });

        it('should return undefined if not boolean string provided', () => {
            expect(transformer.fromQuery('D')).toBeUndefined();
        });
    });

    describe('toQuery', () => {
        it('should return string by boolean value', () => {
            expect(transformer.toQuery(true)).toEqual('true');
            expect(transformer.toQuery(false)).toEqual('false');
        });

        it('should return undefined if undefined provided', () => {
            expect(transformer.toQuery(undefined)).toBeUndefined();
        });
    });
});

describe('enumTransformer', () => {
    enum TestEnum {
        A = 1,
        B = 2,
        C = 3,
    }

    const transformer = enumTransformer(TestEnum);

    describe('fromQuery', () => {
        it('should return enum value by key', () => {
            expect(transformer.fromQuery('A')).toEqual(TestEnum.A);
        });

        it('should return undefined if non existent key provided', () => {
            expect(transformer.fromQuery('D')).toBeUndefined();
        });
    });

    describe('toQuery', () => {
        it('should return key by enum value', () => {
            expect(transformer.toQuery(TestEnum.A)).toEqual('A');
        });

        it('should return undefined if non existent value provided', () => {
            expect(transformer.toQuery(4)).toBeUndefined();
        });

        it('should return undefined if undefined provided', () => {
            expect(transformer.toQuery(undefined)).toBeUndefined();
        });
    });
});

describe('arrayTransformer', () => {
    const delegate: RouteQueryTransformer<string> = {
        fromQuery(value) {
            if (value === 'skip') {
                return undefined;
            }
            return value.toUpperCase();
        },
        toQuery(value) {
            if (value === 'skip') {
                return undefined;
            }
            return value?.toLowerCase();
        },
    };
    const transformer = arrayTransformer(delegate);

    describe('fromQueryArray', () => {
        it('should return array of values by array of strings', () => {
            expect(transformer.fromQueryArray(['a', 'b', 'c'])).toEqual(['A', 'B', 'C']);
        });

        it('should skip values if they not transformed by delegate', () => {
            expect(transformer.fromQueryArray(['a', 'skip', 'c'])).toEqual(['A', 'C']);
        });
    });

    describe('toQueryArray', () => {
        it('should return string array by array of values', () => {
            expect(transformer.toQueryArray(['A', 'B', 'C'])).toEqual(['a', 'b', 'c']);
        });

        it('should skip values if they not transformed by delegate', () => {
            expect(transformer.toQueryArray(['A', 'skip', 'C'])).toEqual(['a', 'c']);
        });
    });
});
