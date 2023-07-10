import { AsyncQueue, createAsyncQueue } from 'async-queue-chain';
import type { Router } from 'vue-router';

import { NavigationMode, RouteQuery } from './types';
import { removeEmptyValues } from './utils';

let queryReplaceQueue: AsyncQueue<RouteQuery> | undefined;

export function queueQueryUpdate(
    router: Router,
    currentQuery: RouteQuery,
    key: string,
    newValue: string | null | undefined,
    mode: NavigationMode,
) {
    if (!queryReplaceQueue) {
        queryReplaceQueue = createAsyncQueue();
    }

    queryReplaceQueue.add((previousQuery) => {
        const newQuery = removeEmptyValues({
            ...previousQuery,
            [key]: newValue,
        });

        return updateQuery(router, previousQuery, newQuery, mode);
    });

    void queryReplaceQueue.run(currentQuery);
}

export async function waitForQueryUpdate() {
    if (queryReplaceQueue) {
        await queryReplaceQueue.waitForFinish();
    }
}

async function updateQuery(router: Router, previousQuery: RouteQuery, query: RouteQuery, mode: NavigationMode) {
    try {
        await router[mode]({
            query,
        });
        return query;
    } catch (e) {
        return previousQuery;
    }
}
