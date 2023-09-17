import { IDuplexStreamUseCase, IDuplexStreamParams, IDuplexStreamResponse } from "@interface/IDuplexStream";
import { removeFileFromPath } from "@utils/file";
import { createWriteStream, renameSync } from "fs";
import { injectable } from "inversify";
import { createReadStream } from "fs";

@injectable()
export default class DuplexStreamUseCase implements IDuplexStreamUseCase {
  constructor() {}

  async execute(params: IDuplexStreamParams): Promise<IDuplexStreamResponse> {
    const { stream, onData } = params;
    let filename: string = null;

    const basePath = __dirname + "/../../arc/";
    const upPath = basePath + "upload";
    removeFileFromPath(upPath);
    const file = createWriteStream(upPath, { encoding: "base64" });

    await new Promise(function (resolve, reject) {
      stream
        .on("data", (chunk: any) => {
          const received = onData(chunk);

          if (received.data === "upload.stream.had.ended") return stream.emit("status", "ended");
          if (!filename) filename = received.filename;

          file.write(received.data);
        })
        .on("status", (status: string) => {
          if (status === "ended") {
            file.end();

            if (filename) {
              const newPath = basePath + filename;
              removeFileFromPath(newPath);
              renameSync(upPath, newPath);
            }

            resolve(null);
          }
        })
        .on("error", (err: Error) => {
          file.end();
          removeFileFromPath(upPath);
          reject(err);
        });
    });

    const downPath = __dirname + "/../../arc/" + "download.csv";
    const upStream = createReadStream(downPath, { highWaterMark: 64 * 1024 });
    return upStream;
  }
}
