import { DownstreamMessage } from "../../../../../../proto/dist";

export class StreamGrpcPresenter {
  static fromDownstreamMessage(response: DownstreamMessage): string {
    const data = response.getData();
    return data;
  }
}
