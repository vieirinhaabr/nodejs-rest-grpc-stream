import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useState } from "react";
import axios, { AxiosResponse } from "axios";
import FileSaver from "file-saver";
import { mapFileFromAxiosResponse } from "@app/utils/file";

export default function Content() {
  const url = "http://127.0.0.1:3000";
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = (event.target.files as FileList)[0];
    if (!file) throw new Error("no file");

    const form = new FormData();
    form.append("file", file);
    return {
      // Pass header arguments
      headers: {
        "content-type": "multipart/form-data",
      },
      data: form,
      // Set no limit for content size
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    };
  };

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const args = handleFileUpload(event);

      await axios({
        ...args,
        method: "post",
        url: `${url}/v1/stream/upstream`,
      });
      alert(`Upload finished`);
    } catch (error) {
      console.error(error);
      alert(`Upload error`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownloadByChunks = (data: string) => {
    let b64 = "";
    data
      .split("$$_stream_chunk_$$")
      .filter((chunk) => chunk !== "")
      .forEach((chunk) => {
        const str = Buffer.from(chunk).toString();
        const decoded = Buffer.from(str, "base64").toString();

        b64 += decoded;
      });

    return b64;
  };

  const onDownloadHasB64 = async () => {
    try {
      setLoading(true);

      const response = await axios<any, AxiosResponse<string>>({
        method: "get",
        url: `${url}/v1/stream/downstream`,
      });

      const data = handleFileDownloadByChunks(response.data);

      const { blob, name } = mapFileFromAxiosResponse(data, response);
      FileSaver.saveAs(blob, name);
    } catch (error) {
      console.error(error);
      alert(`Upload error`);
    } finally {
      setLoading(false);
    }
  };

  const onDownloadHasUtf8 = async () => {
    try {
      setLoading(true);

      const response = await axios<any, AxiosResponse<string>>({
        method: "get",
        url: `${url}/v1/stream/downstream`,
      });

      const { blob, name } = mapFileFromAxiosResponse(response.data, response);
      FileSaver.saveAs(blob, name);
    } catch (error) {
      console.error(error);
      alert(`Upload error`);
    } finally {
      setLoading(false);
    }
  };

  const onDuplex = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log("tsdgfds");
    try {
      setLoading(true);
      const args = handleFileUpload(event);

      const response = await axios<any, AxiosResponse<string>>({
        ...args,
        method: "post",
        url: `${url}/v1/stream/duplex`,
      });

      const data = handleFileDownloadByChunks(response.data);

      const { blob, name } = mapFileFromAxiosResponse(data, response);
      FileSaver.saveAs(blob, name);
    } catch (error) {
      console.error(error);
      alert(`Upload error`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
      <div className="flow text-center">
        <h1 className="text-2xl mb-28 text-gray-400">
          Sending to <span className="text-white">{url}</span>
        </h1>
        <Stack direction="row" spacing={2}>
          <input
            id="upload-stream"
            hidden
            multiple
            accept=".csv, .txt"
            type="file"
            onChange={onUpload}
          />
          <label htmlFor="upload-stream">
            <LoadingButton
              component="span"
              className="bg-blue-700"
              loading={loading}
              variant="contained"
              size="large"
            >
              Upload
            </LoadingButton>
          </label>
          <LoadingButton
            className="bg-green-700"
            color="success"
            loading={loading}
            variant="contained"
            size="large"
            onClick={onDownloadHasB64}
          >
            Download (Base64)
          </LoadingButton>
          <LoadingButton
            className="bg-green-700"
            color="success"
            loading={loading}
            variant="contained"
            size="large"
            onClick={onDownloadHasUtf8}
          >
            Download (UTF-8)
          </LoadingButton>
          <input
            id="duplex-stream"
            multiple
            accept=".csv, .txt"
            type="file"
            onChange={onDuplex}
          />
          <label htmlFor="duplex-stream">
            <LoadingButton
              className="bg-orange-700"
              color="warning"
              loading={loading}
              variant="contained"
              size="large"
            >
              Duplex
            </LoadingButton>
          </label>
        </Stack>
      </div>
    </div>
  );
}
