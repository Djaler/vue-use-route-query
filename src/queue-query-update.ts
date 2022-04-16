import { AsyncQueue, createAsyncQueue } from 'async-queue-chain';
import type VueRouter from 'vue-router';

import { RouteQuery } from './types';
import { removeEmptyValues } from './utils';

let queryReplaceQueue: AsyncQueue<RouteQuery> | undefined;

export function queueQueryUpdate(
    router: VueRouter,
    currentQuery: RouteQuery,
    key: string,
    newValue: string | null | undefined,
) {
    if (!queryReplaceQueue) {
        queryReplaceQueue = createAsyncQueue();
    }

    queryReplaceQueue.add((previousQuery) => {
        const newQuery = removeEmptyValues({
            ...previousQuery,
            [key]: newValue,
        });

        return router.replace({
            query: newQuery,
        })
            .then(newRoute => newRoute.query)
            .catch(() => previousQuery);
    });

    void queryReplaceQueue.run(currentQuery);
}
