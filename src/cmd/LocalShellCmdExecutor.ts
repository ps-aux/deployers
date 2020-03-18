import { CmdExecutor } from 'src/cmd/typed'
import { minimalLogger } from 'src/log/MinimalLogger'
import { Log } from 'src/types'
import { shellCmd } from 'src/cmd/shellCmd'

export class LocalShellCmdExecutor implements CmdExecutor {
    private log: Log

    constructor(log?: Log) {
        this.log = log || minimalLogger()
    }

    exec = (cmd: string) =>
        shellCmd(cmd, {
            returnStdout: false
        })

    execWithStdIn = (cmd: string, stdin: string) =>
        shellCmd(cmd, {
            stdin,
            returnStdout: false
        })

    execAndReturnVal = (cmd: string) =>
        shellCmd(cmd, {
            returnStdout: true
        }) as string
}
