export interface RouteQuery {
    [key: string]: string | Array<string | null> | null | undefined;
}

export type NavigationMode = 'push' | 'replace';
