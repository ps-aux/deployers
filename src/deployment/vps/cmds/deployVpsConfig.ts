import { VpsDeployOps } from 'src/deployment/vps/types'
import { Context } from 'src/cli/Context'
import { toDeploymentCmdOpts, toSshOpts } from 'src/deployment/vps/cmds/opts'
import { DeployConfigCmdOps } from 'src/cli/commands/deployConfigOptions'

export const deployVpsConfig = (
    cmdOps: DeployConfigCmdOps,
    ops: VpsDeployOps,
    ctx: Context
) => {
    const dep = ctx.createDockerDeployer(ops.dir, toSshOpts(ops))
    dep.deployConfig(!!cmdOps.restart)
}

export const deployConfigFromEnv = (
    cmdOps: DeployConfigCmdOps,
    env: string,
    ctx: Context
) => {
    const cfg = ctx.envConfig(env)

    return deployVpsConfig(cmdOps, toDeploymentCmdOpts(cfg), ctx)
}
