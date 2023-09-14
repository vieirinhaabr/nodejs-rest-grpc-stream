import { EHttpMethod } from "../enums/EHttpMethod";

export interface IRequestMappingMetadata {
  path?: string;
  method?: EHttpMethod;
  middleware?: string;
}
