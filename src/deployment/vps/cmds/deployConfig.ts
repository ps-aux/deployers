import { DeploymentCmdOpts } from 'src/deployment/vps/types'
import { createDockerDeployer } from 'src/deployment/vps/DockerDeployer'
import { ExecutionContext } from 'src/cli/ExecutionContext'
import { toDeploymentCmdOpts, toSshOpts } from 'src/deployment/vps/cmds/opts'

export const deployConfig = (
    opts: DeploymentCmdOpts,
    ctx: ExecutionContext
) => {
    const dep = createDockerDeployer(opts.dir, toSshOpts(opts), ctx.log())
    dep.deployConfig()
}

export const deployConfigFromEnv = (env: string, ctx: ExecutionContext) => {
    const cfg = ctx.envConfig(env)

    return deployConfig(toDeploymentCmdOpts(cfg), ctx)
}
