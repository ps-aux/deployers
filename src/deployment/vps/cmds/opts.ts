import { SshOpts } from 'src/types'
import { DeploymentCmdOpts } from 'src/deployment/vps/types'
import { EnvConfig } from 'src/cli/config/Config'

export const toSshOpts = (opts: DeploymentCmdOpts): SshOpts => ({
    host: opts.host,
    user: opts.ssh?.user,
    port: opts.ssh?.port
})

export const toDeploymentCmdOpts = (env: EnvConfig): DeploymentCmdOpts => ({
    host: env.target,
    dir: env.dir,
    ssh: {
        port: env.ssh?.port,
        user: env.ssh?.user
    }
})
