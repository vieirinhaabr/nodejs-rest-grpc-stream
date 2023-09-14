import fg from 'fast-glob'

import resolvePath from './resolvePath'

export default async function getFilesFromPath<TFile>(
  filePaths: Array<string>,
): Promise<Array<{ name: string; file: TFile }>> {
  const getFileName = (filePath: string) => `${filePath.match(/\w+\.[jt]s$/g)?.[0]}`.replace(/\.[jt]s/, '')

  const paths = fg.sync(resolvePath(...filePaths))

  return Promise.all(
    paths.map(async (filePath) => ({
      file: (await import(`${filePath}`)).default as TFile,
      name: getFileName(filePath),
    })),
  )
}
