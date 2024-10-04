import {AppRouteDescription} from '@gravity-ui/expresskit/dist/types';
import {OpenAPIV3} from 'openapi-types';

export interface Schema {
    openapi: string;
    info: OpenAPIV3.InfoObject;
    servers?: OpenAPIV3.ServerObject[];
    paths: PathsObject<RouteWithDescription>;
    components?: OpenAPIV3.ComponentsObject;
    security?: OpenAPIV3.SecurityRequirementObject[];
    tags?: OpenAPIV3.TagObject[];
    externalDocs?: OpenAPIV3.ExternalDocumentationObject;
    'x-express-openapi-additional-middleware'?: (
        | ((request: any, response: any, next: any) => Promise<void>)
        | ((request: any, response: any, next: any) => void)
    )[];
    'x-express-openapi-validation-strict'?: boolean;
}

export interface PathsObject<T extends {} = {}, P extends {} = {}> {
    [pattern: string]: (PathItemObject<T> & P) | undefined;
}

export type PathItemObject<T extends {} = {}> = {
    $ref?: string;
    summary?: string;
    description?: string;
    servers?: OpenAPIV3.ServerObject[];
    parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
} & {
    [method in OpenAPIV3.HttpMethods]?: OpenAPIV3.OperationObject<T>;
};

export interface RouteWithDescription {
    routeDescription: AppRouteDescription;
}

export interface RouteWithOptionalDescription {
    routeDescription?: AppRouteDescription;
}
