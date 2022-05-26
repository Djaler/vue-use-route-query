import { computed, getCurrentInstance } from 'vue-demi';

export function useRouter() {
    const vm = getCurrentInstance();

    if (!vm) {
        throw new ReferenceError('Not found vue instance.');
    }

    return vm.proxy!.$router;
}

export function useRoute() {
    const vm = getCurrentInstance();

    if (!vm) {
        throw new ReferenceError('Not found vue instance.');
    }

    return computed(() => vm.proxy!.$route);
}
