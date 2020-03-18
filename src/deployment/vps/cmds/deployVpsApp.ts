import { Context } from 'src/cli/Context'
import { VpsDeployOps } from 'src/deployment/vps/types'
import { toDeploymentCmdOpts, toSshOpts } from 'src/deployment/vps/cmds/opts'
import { createConfigVersionDetector } from 'src/version-detection/ConfigVersionDetector'
import { DeployAppCmdOps } from 'src/cli/commands/deployAppOptions'

export const deployVpsApp = (
    appOps: DeployAppCmdOps,
    ops: VpsDeployOps,
    ctx: Context
) => {
    const dep = ctx.createDockerDeployer(ops.dir, toSshOpts(ops))
    dep.deployApp(appOps.version, {
        copyFromRepo: appOps.copyFromRepo
    })
}

export const deployEnvApp = (env: string, version: string, ctx: Context) => {
    const cfg = ctx.envConfig(env)

    return deployVpsApp(
        {
            version,
            copyFromRepo: cfg.copyFromRepo
        },
        toDeploymentCmdOpts(cfg),
        ctx
    )
}

export const deployEnvAppBasedOnEnv = async (
    env: string,
    versionFromEnv: string,
    ctx: Context
) => {
    const cfg = ctx.config()

    const versionDetector = createConfigVersionDetector(cfg, versionFromEnv)
    const version = await versionDetector.getVersion()

    return deployEnvApp(env, version, ctx)
}
