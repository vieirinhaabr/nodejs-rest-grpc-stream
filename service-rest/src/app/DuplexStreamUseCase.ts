import {
  IDuplexStreamUseCase,
  IDuplexStreamParams,
  IDuplexStreamResponse,
  IDuplexStreamGrpcAction,
} from "@interface/IDuplexStream";
import { inject, injectable } from "inversify";
import TYPES from "@core/Types";

@injectable()
export default class DuplexStreamUseCase implements IDuplexStreamUseCase {
  constructor(
    @inject(TYPES.DuplexStreamGrpcAction)
    private action: IDuplexStreamGrpcAction,
  ) {}

  async execute(params: IDuplexStreamParams): Promise<IDuplexStreamResponse> {
    return this.action.call(params);
  }
}
