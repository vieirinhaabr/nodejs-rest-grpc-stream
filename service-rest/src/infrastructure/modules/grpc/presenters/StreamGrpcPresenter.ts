import { DownstreamMessage } from "../../../../../../proto/dist";

export class StreamGrpcPresenter {
  static fromDownstreamMessage(response: DownstreamMessage): string {
    const data = Buffer.from(response.getData(), "base64").toString("utf-8");
    return data;
  }
}
