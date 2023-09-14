import { DownstreamMessage } from "../../../../../../proto/dist";

export interface IStreamDataToSend {
  data: string;
}

export class StreamGrpcPresenter {
  static toDownstreamMessage(params: IStreamDataToSend): DownstreamMessage {
    return new DownstreamMessage().setData(params.data);
  }
}
