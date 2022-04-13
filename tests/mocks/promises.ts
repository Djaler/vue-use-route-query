import { setImmediate } from 'timers';

export function flushPromises(): Promise<void> {
    return new Promise((resolve) => {
        setImmediate(resolve);
    });
}
