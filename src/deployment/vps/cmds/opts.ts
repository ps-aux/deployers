import { SshOpts } from 'src/types'
import { VpsDeployOps } from 'src/deployment/vps/types'
import { EnvConfig } from 'src/cli/config/Config'

export const toSshOpts = (opts: VpsDeployOps): SshOpts => ({
    host: opts.host,
    user: opts.ssh?.user,
    port: opts.ssh?.port
})

export const toDeploymentCmdOpts = (env: EnvConfig): VpsDeployOps => ({
    host: env.target,
    dir: env.dir,
    ssh: {
        port: env.ssh?.port,
        user: env.ssh?.user
    }
})
