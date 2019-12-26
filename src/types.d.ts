/**
 * Path local to a given dir.
 * Nop absolute path and not starting with .. or .
 */
export type LocalPath = string

export type Logger = (...args) => void

export type SshOpts = {
    host: string
    user?: string
    port?: number
}
