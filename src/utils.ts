import {HTTP_METHODS as ALLOWED_HTTP_METHODS, HttpMethod} from '@gravity-ui/expresskit/dist/types';

export function isAllowedMethod(method: string): method is HttpMethod | 'mount' {
    return ALLOWED_HTTP_METHODS.includes(method as any) || method === 'mount';
}

export function formatMethodAndPath(
    method: string,
    path: string,
): `${Uppercase<HttpMethod>} ${string}` {
    return `${method.toUpperCase() as Uppercase<HttpMethod>} ${path}`;
}
