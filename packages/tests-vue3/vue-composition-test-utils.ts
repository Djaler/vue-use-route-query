/**
 * https://github.com/ariesjia/vue-composition-test-utils with some changes
 * TODO: fork
 */
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { h } from 'vue';

type MountingOptions = Parameters<typeof shallowMount>[1];

export interface MountResult<R> extends VueWrapper {
    result: R;
}

export function mountComposition<R>(callback: () => R, options: MountingOptions = {}): MountResult<R> {
    let result: R;
    let error: unknown;
    const vueWrapper = shallowMount({
        render: () => h('div'),
        setup() {
            try {
                result = callback();
            } catch (e) {
                error = e;
            }
            return {
                result,
            };
        },
    }, options);

    if (error) {
        throw error;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.assign(vueWrapper, { result });
}
