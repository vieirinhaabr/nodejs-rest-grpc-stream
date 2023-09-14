import { DownstreamMessage } from "../../../../../../proto/dist";

export class StreamPresenter {
  static fromDownstreamMessage(response: DownstreamMessage): string {
    const data = response.getData();
    return data;
  }
}
