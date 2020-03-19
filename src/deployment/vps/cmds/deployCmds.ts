import { VpsDeployOps } from 'src/deployment/vps/types'
import { DeployAppCmd, DeployConfigCmd, SshOpts } from 'src'
import { EnvConfig } from 'src/cli/config/Config'
import { Context } from 'src/cli/Context'
import { DeployEnvConfigToPlatform } from 'src/deployment/env/cmds/deployEnvConfig'
import { DeployEnvAppToPlatform } from 'src/deployment/env/cmds/deployEnvApp'

export const toSshOpts = (opts: VpsDeployOps): SshOpts => ({
    host: opts.host,
    user: opts.ssh?.user,
    port: opts.ssh?.port
})

export const deployVpsApp = (
    cmd: DeployAppCmd,
    ops: VpsDeployOps,
    ctx: Context
) => {
    ctx.createVpsDeployer(ops.dir, toSshOpts(ops)).deployApp(cmd)
}

export const deployVpsConfig = (
    cmd: DeployConfigCmd,
    ops: VpsDeployOps,
    ctx: Context
) => {
    ctx.createVpsDeployer(ops.dir, toSshOpts(ops)).deployConfig(cmd)
}

// Env

export const toDeploymentCmdOpts = (env: EnvConfig): VpsDeployOps => ({
    host: env.target,
    dir: env.dir,
    ssh: {
        port: env.ssh?.port,
        user: env.ssh?.user
    }
})

export const deployEnvConfigToVps: DeployEnvConfigToPlatform = (
    cmd: DeployConfigCmd,
    cfg: EnvConfig,
    ctx: Context
) => {
    deployVpsConfig(cmd, toDeploymentCmdOpts(cfg), ctx)
}

export const deployEnvAppToVps: DeployEnvAppToPlatform = (
    cmd: DeployAppCmd,
    cfg: EnvConfig,
    ctx: Context
) => {
    deployVpsApp(cmd, toDeploymentCmdOpts(cfg), ctx)
}
