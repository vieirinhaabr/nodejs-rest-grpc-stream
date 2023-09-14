import { IDownStreamUseCase, IDownStreamResponse } from "@interface/IDownStream";
import { createReadStream } from "fs";
import { injectable } from "inversify";

@injectable()
export default class DownStreamUseCase implements IDownStreamUseCase {
  execute(): IDownStreamResponse {
    const path = __dirname + "/../../arc/" + "download.csv";
    const stream = createReadStream(path);
    return stream;
  }
}
