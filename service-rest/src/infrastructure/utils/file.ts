import { existsSync, unlinkSync } from 'fs'

export function removeFileFromPath(path: string) {
  const exists = existsSync(path)
  if (exists) unlinkSync(path)
}
