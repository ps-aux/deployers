import {
    CopyTextFileOpts,
    RemoteCommandExecutor,
    RemoteFileApi
} from 'src/remote/index'
import { LocalPath, Logger, SshOpts } from 'src/types'
import { execSync } from 'child_process'

const connectionArg = (opts: SshOpts) => {
    let url = opts.host

    if (opts.user) url = `${opts.user}@` + url

    if (opts.port) url = `-p ${opts.port} ` + url

    return url
}

const sshCmd = (
    cmd: string,
    opts: SshOpts,
    returnStdout: boolean,
    stdIn?: string,
    log?: (...any) => void
): string | null => {
    cmd = cmd.replace(/'/g, "\\'")
    const args = connectionArg(opts)

    let fullCmd = `ssh ${args} '${cmd}'`

    if (stdIn) {
        fullCmd = `echo '${stdIn}' | ` + fullCmd
    }

    if (log) {
        log('[ssh]', fullCmd)
    }

    const res = execSync(fullCmd, {
        stdio: ['inherit', returnStdout ? undefined : 'inherit', 'inherit']
    })

    if (returnStdout) return res.toString()
    return null
}

export type SshApiOpts = {
    ssh: SshOpts
    log?: Logger
}

class CmdBuilder {
    _cmd = 'set -e;\n'

    add = (cmd: string): CmdBuilder => {
        this._cmd = this._cmd + '\n' + cmd + ';'
        return this
    }

    cmd = (): string => {
        if (!this._cmd) throw new Error('No command was set')
        return this._cmd
    }
}

const ensureLocalPath = (path: LocalPath) => {
    if (path.startsWith('/') || path.startsWith('..'))
        throw new Error(`${path} starts with '/' or '..'. This is not allowed`)
}

class SshApi implements RemoteFileApi, RemoteCommandExecutor {
    readonly opts: SshOpts
    readonly log: Logger

    constructor(opts: SshApiOpts) {
        this.opts = opts.ssh
        this.log = opts.log || (() => undefined)
    }

    copyTextFile = (
        dir: LocalPath,
        path: LocalPath,
        content: string,
        opts: CopyTextFileOpts = {}
    ) => {
        ensureLocalPath(dir)
        ensureLocalPath(path)

        const cmds = new CmdBuilder()

        cmds.add(`cd ${dir}`)
        if (opts.createIntermediateDirs) cmds.add(`mkdir -p $(dirname ${path})`)
        cmds.add(`cat > ${path}`)

        const cmd = cmds.cmd()
        sshCmd(cmd, this.opts, false, content || '\n')
    }

    ensureDir = (path: LocalPath) => {
        ensureLocalPath(path)
        sshCmd(`mkdir -p ${path}`, this.opts, false)
    }

    execRemoteCmd = (dir: LocalPath, cmd: string, returnStdout?: boolean) => {
        const cmds = new CmdBuilder()
        cmds.add(`cd ${dir}`)
        cmds.add(cmd)

        const res = sshCmd(
            cmds.cmd(),
            this.opts,
            !!returnStdout,
            undefined,
            this.log
        )

        if (res != null) return res.trim()

        return null
    }
}

export const createSshApi = (opts: SshApiOpts) => new SshApi(opts)