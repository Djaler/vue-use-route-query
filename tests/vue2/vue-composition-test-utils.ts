/**
 * https://github.com/ariesjia/vue-composition-test-utils with some changes
 * TODO: fork
 */
import { shallowMount, Wrapper } from '@vue/test-utils';
import Vue, { CreateElement } from 'vue';

type MountingOptions = Parameters<typeof shallowMount>[1] & {
    component?: any;
};

export interface MountResult<R> extends Wrapper<Vue> {
    result: R;
    error: unknown;
}

export function mountComposition<R>(callback: () => R, options: MountingOptions = {}): MountResult<R> {
    let result: R;
    let error: unknown;
    const { component = {}, ...other } = options;
    const Wrap = {
        render: (h: CreateElement) => h('div'),
        ...component,
        setup() {
            try {
                result = callback();
            } catch (e) {
                error = e;
            }
            return {
                result,
                error,
            };
        },
    };

    const vueWrapper = shallowMount(Wrap, other);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.assign(vueWrapper, { result, error });
}
