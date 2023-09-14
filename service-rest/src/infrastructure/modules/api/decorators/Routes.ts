import { isEmpty } from "lodash";
import { EHttpMethod } from "../enums/EHttpMethod";
import { IRequestMappingMetadata } from "../interfaces/IRequestMappingMetadata";

const defaultMetadata = {
  path: "/",
  method: EHttpMethod.GET,
};

export const RequestMapping = (metadata: IRequestMappingMetadata = defaultMetadata): MethodDecorator => {
  const { path, method, middleware } = metadata;

  return (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata("type", "route", descriptor.value);
    Reflect.defineMetadata("path", isEmpty(path) ? "/" : path, descriptor.value);
    Reflect.defineMetadata("method", method || EHttpMethod.GET, descriptor.value);
    Reflect.defineMetadata("middleware", middleware, descriptor.value);

    return descriptor;
  };
};

const createRouteDecorator =
  (method: EHttpMethod) =>
  (path?: string, middleware?: string): MethodDecorator => {
    return RequestMapping({
      path,
      method,
      middleware,
    });
  };

export const Get = createRouteDecorator(EHttpMethod.GET);

export const Post = createRouteDecorator(EHttpMethod.POST);

export const Delete = createRouteDecorator(EHttpMethod.DELETE);

export const Put = createRouteDecorator(EHttpMethod.PUT);

export const Patch = createRouteDecorator(EHttpMethod.PATCH);
