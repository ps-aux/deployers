import { createDeployer } from 'src/deployment/Deployer'
import { ExecutionContext } from 'src/cli/ExecutionContext'
import { DeploymentCmdOpts } from 'src/deployment/types'

export const deployApp = (
    version: string,
    opts: DeploymentCmdOpts,
    ctx: ExecutionContext,
    copyFromRepo?: string
) => {
    const dep = createDeployer(opts.dir, { host: opts.host }, ctx.log())
    dep.deployApp(version, {
        copyFromRepo
    })
}

export const deployAppFromEnv = (
    env: string,
    version: string,
    ctx: ExecutionContext
) => {
    const cfg = ctx.envConfig(env)

    return deployApp(
        version,
        {
            host: cfg.target,
            dir: cfg.dir
        },
        ctx
    )
}
