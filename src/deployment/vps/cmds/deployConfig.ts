import { DeploymentCmdOpts } from 'src/deployment/vps/types'
import { Context } from 'src/cli/Context'
import { toDeploymentCmdOpts, toSshOpts } from 'src/deployment/vps/cmds/opts'

export const deployConfig = (
    opts: DeploymentCmdOpts,
    ctx: Context,
    restart: boolean
) => {
    const dep = ctx.createDockerDeployer(opts.dir, toSshOpts(opts))
    dep.deployConfig(restart)
}

export const deployConfigFromEnv = (
    env: string,
    ctx: Context,
    restart: boolean
) => {
    const cfg = ctx.envConfig(env)

    return deployConfig(toDeploymentCmdOpts(cfg), ctx, restart)
}
