/**
 * Path local to a given dir.
 * Nop absolute path and not starting with .. or .
 */
import { CopyTextFileOpts } from 'src/remote'

export type LocalPath = string

export type Logger = (...args) => void

export type Deployer = {
    deployApp: () => void
    deployConfig: () => void
}

export type RemoteApi = {
    copyTextFile: (
        dir: LocalPath,
        path: LocalPath,
        content: string,
        opts?: CopyTextFileOpts
    ) => void

    ensureDir: (path: LocalPath) => void

    execRemoteCmd: (
        path: LocalPath,
        cmd: string,
        returnStdOut?: boolean
    ) => string | null
}

export type SshOpts = {
    host: string
    user?: string
    port?: number
}
