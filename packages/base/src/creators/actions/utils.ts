import type { Analyze, ParsePath } from "url-ast";

export function buildCustomId<Parse extends string>(
    ast: Analyze<Parse>,
    params: ParsePath<Parse>['params'],
    query?: ParsePath<Parse>['searchParams']
): string {
    let entrypoint = ast.getPathname();

    Object.entries(params).forEach(([key, value]) => {
        const parameterRegex = new RegExp(`:${key}(\\.[a-zA-Z0-9]+)?`, 'g');
        entrypoint = entrypoint.replace(parameterRegex, String(value));
    });

    if (query) {
        const queryString = Object.entries(query)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join('&');

        if (queryString.length > 0) entrypoint += `?${queryString}`;
    }

    return entrypoint;
}
