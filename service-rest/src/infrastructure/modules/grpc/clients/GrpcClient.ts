import { IAppConfig } from "@core/AppConfig";
import { Client } from "@grpc/grpc-js";

export class GrpcClient {
  static build(config: IAppConfig): Client {
    throw new Error("build method not implemented.");
  }
}
