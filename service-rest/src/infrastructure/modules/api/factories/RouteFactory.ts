import { IRoute } from "../interfaces/IRoute";
import { IRouter } from "../interfaces/IRouter";

export class RouteFactory {
  static createController(controller: any): IRouter {
    const prototype = Object.getPrototypeOf(controller);

    const type = Reflect.getMetadata("type", prototype);
    if (type === "router") {
      const path = Reflect.getMetadata("path", prototype);
      const middleware = Reflect.getMetadata("middleware", prototype);

      return { path, middleware };
    }

    throw new Error("This class is not a router instance");
  }

  static createRoutes(controller: any): IRoute[] {
    const prototype = Object.getPrototypeOf(controller);
    const properties = Object.getOwnPropertyNames(prototype);

    const routes: IRoute[] = [];
    for (const property of properties) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, property);

      const type = Reflect.getMetadata("type", descriptor.value);
      if (type === "route") {
        const path = Reflect.getMetadata("path", descriptor.value);
        const method = Reflect.getMetadata("method", descriptor.value);
        const middleware = Reflect.getMetadata("middleware", descriptor.value);

        routes.push({ method, path, handler: controller[property].bind(controller), middleware });
      }
    }

    if (!routes.length) {
      throw new Error("This class has no routes defined");
    }

    return routes;
  }
}
