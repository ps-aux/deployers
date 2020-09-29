/**
 * Path local to a given dir.
 * Nop absolute path and not starting with .. or .
 */
import { CopyTextFileOpts } from 'src/cmd/remote'

export type LocalPath = string

export type LogMsg = (...args: any[]) => void

export type Log = {
    info: LogMsg
    debug: LogMsg
    error: LogMsg
}

export type DeployAppCmd = {
    version: string
    copyFromRepo?: string
}

export type DeployConfigCmd = {
    restart: boolean
}

export interface Deployer {
    deployApp: (cmd: DeployAppCmd) => void
    deployConfig: (cmd: DeployConfigCmd) => void
}

export interface VersionDetector {
    getVersion: () => Promise<string>
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

export type DoTemplate = (templateContent: string, data: any) => string

export type SshOpts = {
    host: string
    user?: string
    port?: number
}
