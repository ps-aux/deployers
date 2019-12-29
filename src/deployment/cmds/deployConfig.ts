import { DeploymentCmdOpts } from 'src/deployment/types'
import { createDeployer } from 'src/deployment/Deployer'
import { ExecutionContext } from 'src/cli/ExecutionContext'
import { toDeploymentCmdOpts, toSshOpts } from 'src/deployment/cmds/opts'

export const deployConfig = (
    opts: DeploymentCmdOpts,
    ctx: ExecutionContext
) => {
    const dep = createDeployer(opts.dir, toSshOpts(opts), ctx.log())
    dep.deployConfig()
}

export const deployConfigFromEnv = (env: string, ctx: ExecutionContext) => {
    const cfg = ctx.envConfig(env)

    return deployConfig(toDeploymentCmdOpts(cfg), ctx)
}
