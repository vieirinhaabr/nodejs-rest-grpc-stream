export default function concatPaths(...paths: string[]): string {
  const values = [];
  for (const path of paths) {
    values.push(path.replace(/^\/+|\/+$/g, ""));
  }

  const result = values.join("/");
  if (result.startsWith("/")) return result;
  return "/" + result;
}
