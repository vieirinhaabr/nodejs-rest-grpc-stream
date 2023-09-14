import { IStreamHeaders } from "../interfaces/IStreamHeaders";

const HASH_REGEX = /-{5}(\d+)/;
const FILENAME_REGEX = /filename="([^"]+)"/;

export function getStreamHeaders(chunk: Uint8Array): IStreamHeaders {
  const text = Buffer.from(chunk).toString("utf-8");

  if (!text.includes("Content-Disposition: form-data;")) return;

  const hash = (HASH_REGEX.exec(text) || [])[1];
  const filename = (FILENAME_REGEX.exec(text) || [])[1];

  if (hash && filename)
    return {
      hash: hash,
      filename: filename,
    };
}

export function ignoreChunk(headers: IStreamHeaders, chunk: Uint8Array): boolean {
  const text = Buffer.from(chunk).toString("utf-8");

  const hash = (HASH_REGEX.exec(text) || [])[1];

  return headers.hash === hash;
}
