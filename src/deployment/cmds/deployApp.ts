import { createDeployer } from 'src/deployment/Deployer'
import { ExecutionContext } from 'src/cli/ExecutionContext'
import { DeploymentCmdOpts } from 'src/deployment/types'
import { toDeploymentCmdOpts, toSshOpts } from 'src/deployment/cmds/opts'
import { createConfigVersionDetector } from 'src/version-detection/ConfigVersionDetector'

export const deployApp = (
    version: string,
    opts: DeploymentCmdOpts,
    ctx: ExecutionContext,
    copyFromRepo?: string
) => {
    const dep = createDeployer(opts.dir, toSshOpts(opts), ctx.log())
    dep.deployApp(version, {
        copyFromRepo
    })
}

export const deployEnvApp = (
    env: string,
    version: string,
    ctx: ExecutionContext
) => {
    const cfg = ctx.envConfig(env)

    return deployApp(version, toDeploymentCmdOpts(cfg), ctx, cfg.copyFromRepo)
}

export const deployEnvAppBasedOnEnv = async (
    env: string,
    versionFromEnv: string,
    ctx: ExecutionContext
) => {
    const cfg = ctx.config()

    const versionDetector = createConfigVersionDetector(cfg, versionFromEnv)
    const version = await versionDetector.getVersion()

    return deployEnvApp(env, version, ctx)
}
