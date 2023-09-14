import { UpstreamMessage } from "../../../../../../proto/dist";

export interface IStreamDataReceived {
  data: string;
  filename?: string;
}

export class StreamGrpcController {
  static toUpstreamMessage(params: IStreamDataReceived): UpstreamMessage {
    const { data, filename } = params;

    const request = new UpstreamMessage().setData(data).setFilename(filename);
    return request;
  }
}
