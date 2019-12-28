import { DeploymentCmdOpts } from 'src/deployment/types'
import { createDeployer } from 'src/deployment/Deployer'
import { ExecutionContext } from 'src/cli/ExecutionContext'

export const deployConfig = (
    opts: DeploymentCmdOpts,
    ctx: ExecutionContext
) => {
    const dep = createDeployer(opts.dir, { host: opts.host }, ctx.log())
    dep.deployConfig()
}

export const deployConfigFromEnv = (env: string, ctx: ExecutionContext) => {
    const cfg = ctx.envConfig(env)

    return deployConfig(
        {
            host: cfg.target,
            dir: cfg.dir
        },
        ctx
    )
}
