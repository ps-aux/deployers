export type ExecCmd = (cmd: string) => void

export type ExecCmdAndReturnVal = (cmd: string) => string

export type CmdExecutor = {
    exec: ExecCmd
    execAndReturnVal: ExecCmdAndReturnVal
}
