import { IAppConfig } from "@core/AppConfig";

import { credentials } from "../../../../../../proto/node_modules/@grpc/grpc-js";
import { StreamServiceClient } from "../../../../../../proto/dist";
import { GrpcClient } from "./GrpcClient";

export default class StreamGrpcClient extends GrpcClient {
  static build(config: IAppConfig): StreamServiceClient {
    return new StreamServiceClient(config.grpc.host, credentials.createInsecure());
  }
}
