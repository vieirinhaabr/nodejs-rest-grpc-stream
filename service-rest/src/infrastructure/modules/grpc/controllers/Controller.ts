import { Empty } from 'google-protobuf/google/protobuf/empty_pb'

export class Controller {
  static toEmptyRequest(): Empty {
    return new Empty()
  }
}
