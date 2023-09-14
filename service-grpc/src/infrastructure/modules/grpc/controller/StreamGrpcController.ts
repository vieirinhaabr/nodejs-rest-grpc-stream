import { IUpStreamChunk } from "@interface/IUpStream";

import { UpstreamMessage } from "../../../../../../proto/dist";

export class StreamGrpcController {
  static fromUpstreamMessage(response: UpstreamMessage): IUpStreamChunk {
    return {
      data: response.getData(),
      filename: response.getFilename(),
    };
  }
}
