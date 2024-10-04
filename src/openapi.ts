import fs from 'fs/promises';
import path from 'path';

import {AppRoutes} from '@gravity-ui/expresskit/dist/types';
import jsyaml from 'js-yaml';
import {OpenAPIV3} from 'openapi-types';

import {RouteWithDescription, RouteWithOptionalDescription, Schema as Schema} from './types';
import {formatMethodAndPath, isAllowedMethod} from './utils';

export class OpenAPI {
    private schema: Schema;
    private spec: OpenAPIV3.Document<{}> | null = null;
    private _routes: AppRoutes | null = null;

    constructor(schema: Schema) {
        this.schema = schema;
        this.spec = this.getClearSpec(schema);
    }

    get routes() {
        if (this._routes) {
            return this._routes;
        }

        return this.createRoutes();
    }

    async save(out: string) {
        const yamlData = jsyaml.dump(this.spec, {skipInvalid: true});
        const file = path.resolve(out);

        return fs.writeFile(file, yamlData, 'utf-8');
    }

    private createRoutes(): AppRoutes {
        const pathsRoutes = this.getRoutesFromPaths();

        this._routes = {...pathsRoutes};
        return this._routes;
    }

    private getRoutesFromPaths(): AppRoutes {
        const appRoutes: AppRoutes = {};
        const paths = this.schema.paths;

        for (const [path, pathItemObject] of Object.entries(paths)) {
            if (!pathItemObject) {
                continue;
            }
            for (const [fieldName, operationObject] of Object.entries(pathItemObject)) {
                if (!isAllowedMethod(fieldName)) {
                    continue;
                }
                const methodAndPath = formatMethodAndPath(fieldName, path);
                const appRouteDescription = (
                    operationObject as OpenAPIV3.OperationObject<RouteWithDescription>
                ).routeDescription;
                appRoutes[methodAndPath] = appRouteDescription;
            }
        }

        return appRoutes;
    }

    private getClearSpec(schema: Schema): OpenAPIV3.Document<{}> {
        const schemaCopy: OpenAPIV3.Document<{}> = JSON.parse(JSON.stringify(schema));
        const cleanedPaths: OpenAPIV3.Document<{}>['paths'] = {};

        for (const [path, pathItemObject] of Object.entries(schemaCopy.paths)) {
            if (!pathItemObject) {
                continue;
            }
            const newPathItem = {...pathItemObject};
            for (const [fieldName, operationObject] of Object.entries(newPathItem)) {
                if (!isAllowedMethod(fieldName)) {
                    continue;
                }
                delete (operationObject as OpenAPIV3.OperationObject<RouteWithOptionalDescription>)
                    .routeDescription;
                cleanedPaths[path] = newPathItem;
            }

            schemaCopy.paths = cleanedPaths;
        }

        return schemaCopy;
    }
}
