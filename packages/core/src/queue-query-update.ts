import { AsyncQueue, createAsyncQueue } from 'async-queue-chain';
import type { Router } from 'vue-router';

import { RouteQuery } from './types';
import { removeEmptyValues } from './utils';

let queryReplaceQueue: AsyncQueue<RouteQuery> | undefined;

export function queueQueryUpdate(
    router: Router,
    currentQuery: RouteQuery,
    key: string,
    newValue: string | string[] | null | undefined,
) {
    if (!queryReplaceQueue) {
        queryReplaceQueue = createAsyncQueue();
    }

    queryReplaceQueue.add((previousQuery) => {
        const newQuery = removeEmptyValues({
            ...previousQuery,
            [key]: newValue,
        });

        return updateQuery(router, previousQuery, newQuery);
    });

    void queryReplaceQueue.run(currentQuery);
}

async function updateQuery(router: Router, previousQuery: RouteQuery, query: RouteQuery) {
    try {
        await router.replace({
            query,
        });
        return query;
    } catch (e) {
        return previousQuery;
    }
}
