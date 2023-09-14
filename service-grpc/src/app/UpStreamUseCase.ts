import { IUpStreamUseCase, IUpStreamParams } from "@interface/IUpStream";
import { removeFileFromPath } from "@utils/file";
import { createWriteStream, renameSync } from "fs";
import { injectable } from "inversify";

@injectable()
export default class UpStreamUseCase implements IUpStreamUseCase {
  constructor() {}

  async execute(params: IUpStreamParams): Promise<void> {
    const { stream, onData } = params;
    let filename: string = null;

    const basePath = __dirname + "/../../arc/";
    const path = basePath + "upload";
    removeFileFromPath(path);
    const file = createWriteStream(path, { encoding: "base64" });

    return new Promise(function (resolve, reject) {
      stream
        .on("data", (chunk: any) => {
          const received = onData(chunk);

          if (!filename) filename = received.filename;

          file.write(received.data);
        })
        .on("close", () => {
          file.end();

          if (filename) {
            const newPath = basePath + filename;
            removeFileFromPath(newPath);
            renameSync(path, newPath);
          }

          resolve();
        })
        .on("error", (err: Error) => {
          file.end();
          removeFileFromPath(path);
          reject(err);
        });
    });
  }
}
