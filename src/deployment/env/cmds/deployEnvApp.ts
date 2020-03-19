import { Context } from 'src/cli/Context'
import { DeploymentType, EnvConfig } from 'src/cli/config/Config'
import { createConfigVersionDetector } from 'src/version-detection/ConfigVersionDetector'
import { deployEnvAppToK8s } from 'src/deployment/k8s/cmds/deployCmds'
import { DeployAppCmd } from 'src'
import { deployEnvAppToVps } from 'src/deployment/vps/cmds/deployCmds'

export type DeployEnvAppToPlatform = (
    ops: DeployAppCmd,
    cfg: EnvConfig,
    ctx: Context
) => void

const getDeployer = (type: string): DeployEnvAppToPlatform => {
    if (type === DeploymentType.VPS) {
        return deployEnvAppToVps
    } else if (type === DeploymentType.K8S) {
        return deployEnvAppToK8s
    }
    throw new Error('Unexpected deployment type: ' + type)
}

export const deployEnvAppVersionFromOtherEnv = async (
    env: string,
    otherEnv: string,
    ctx: Context
): Promise<void> => {
    const cfg = ctx.config()
    ctx.log().info(`Deploying version from ${otherEnv}`)

    const versionDetector = createConfigVersionDetector(cfg, otherEnv)
    const version = await versionDetector.getVersion()
    ctx.log().info(`${otherEnv} runs version ${version}`)

    deployEnvApp(env, version, ctx)
}

export const deployEnvApp = (env: string, version: string, ctx: Context) => {
    ctx.log().info(`Deploying version ${version} to  ${env}`)
    const cfg = ctx.envConfig(env)
    getDeployer(cfg.type)(
        {
            version,
            copyFromRepo: cfg.copyFromRepo
        },
        cfg,
        ctx
    )
}
