import TYPES from "@core/Types";
import { IUpStreamUseCase, IUpStreamParams, IUpStreamGrpcAction } from "@interface/IUpStream";
import { inject, injectable } from "inversify";

@injectable()
export default class UpStreamUseCase implements IUpStreamUseCase {
  constructor(
    @inject(TYPES.UpStreamGrpcAction)
    private action: IUpStreamGrpcAction,
  ) {}

  async execute(params: IUpStreamParams): Promise<void> {
    return await this.action.call(params);
  }
}
