import { Context } from 'src/cli/Context'
import { DeploymentType, EnvConfig } from 'src/cli/config/Config'
import { deployEnvConfigToK8s } from 'src/deployment/k8s/cmds/deployCmds'
import { DeployConfigCmd } from 'src'
import { deployEnvConfigToVps } from 'src/deployment/vps/cmds/deployCmds'

export type DeployEnvConfigToPlatform = (
    cmd: DeployConfigCmd,
    cfg: EnvConfig,
    ctx: Context
) => void

const getDeployer = (type: string): DeployEnvConfigToPlatform => {
    if (type === DeploymentType.VPS) {
        return deployEnvConfigToVps
    } else if (type === DeploymentType.K8S) {
        return deployEnvConfigToK8s
    }
    throw new Error('Unexpected deployment type: ' + type)
}

export const deployEnvConfig = (
    cmd: DeployConfigCmd,
    env: string,
    ctx: Context
) => {
    ctx.log().info(`Deploying ${env} config`)
    const cfg = ctx.envConfig(env)
    getDeployer(cfg.type)(cmd, cfg, ctx)
}
