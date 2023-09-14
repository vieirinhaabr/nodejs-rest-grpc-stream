export function Router(): ClassDecorator;

export function Router(prefix: string, middleware?: string): ClassDecorator;

export function Router(prefix?: string, middleware?: string): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata("type", "router", target.prototype);
    Reflect.defineMetadata("path", prefix ?? "/", target.prototype);
    Reflect.defineMetadata("middleware", middleware, target.prototype);
  };
}
