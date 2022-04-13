import { computed, ComputedRef, getCurrentInstance } from '@vue/composition-api';
import type VueRouter from 'vue-router';
import type { Route } from 'vue-router';

export function useRouter(): VueRouter {
    const vm = getCurrentInstance();

    if (!vm) {
        throw new ReferenceError('Not found vue instance.');
    }

    return vm.proxy.$router;
}

export function useRoute(): ComputedRef<Route> {
    const vm = getCurrentInstance();

    if (!vm) {
        throw new ReferenceError('Not found vue instance.');
    }

    return computed(() => vm.proxy.$route);
}
