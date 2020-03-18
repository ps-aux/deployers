import { LocalPath } from 'src'

export type CopyTextFileOpts = { createIntermediateDirs?: boolean }

export type RemoteFileApi = {
    copyTextFile: (
        dir: LocalPath,
        path: LocalPath,
        content: string,
        opts?: CopyTextFileOpts
    ) => void

    ensureDir: (path: LocalPath) => void
}

export type RemoteCommandExecutor = {
    execRemoteCmd: (
        path: LocalPath,
        cmd: string,
        returnStdOut?: boolean
    ) => string | null
}
