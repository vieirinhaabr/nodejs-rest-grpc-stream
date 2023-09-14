import { IDownStreamUseCase, IDownStreamResponse, IDownStreamGrpcAction } from "@interface/IDownStream";
import { inject, injectable } from "inversify";
import TYPES from "@core/Types";

@injectable()
export default class DownStreamUseCase implements IDownStreamUseCase {
  constructor(
    @inject(TYPES.DownStreamGrpcAction)
    private action: IDownStreamGrpcAction,
  ) {}

  async execute(): Promise<IDownStreamResponse> {
    return this.action.call();
  }
}
