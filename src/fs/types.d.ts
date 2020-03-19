import { LocalPath } from 'src/types'

export type DirFileItem = {
    absPath: string
    localPath: LocalPath
}

export type FilesReader = {
    read: (path: string) => string
}
