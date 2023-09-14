import { EmptyMessage } from "../../../../../../proto/dist";

export class GrpcController {
  static toEmptyRequest(): EmptyMessage {
    return new EmptyMessage();
  }
}
