import path from 'path'

export default function resolvePath(...pathSegments: string[]): string {
  return path.resolve(...pathSegments).replace(new RegExp('\\' + path.sep, 'g'), '/')
}
