import { Stream } from "stream";

export interface IReceiveStream<D> {
  stream: Stream;
  onData: (chunk: any) => D;
}
