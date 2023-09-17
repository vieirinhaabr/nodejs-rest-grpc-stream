import { AxiosResponse } from "axios";

const typeFromContentType = /^([^; ]+)/;
const extensionFromContentType = /\/([^/;]+);/;

export const mapFileFromAxiosResponse = (
  data: string,
  { headers }: AxiosResponse<any, any>
) => {
  const content = headers["content-type"] as string;

  const [_t, type] = content.match(typeFromContentType) || [];
  const [_e, extension] = content.match(extensionFromContentType) || [];
  const blob = new Blob([data], { type });

  return {
    blob,
    name: `file.${extension}`,
  };
};
