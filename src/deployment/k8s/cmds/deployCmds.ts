import { Context } from 'src/cli/Context'
import { K8sDeployOps } from 'src/deployment/k8s/createK8sDeployer'
import { DeployEnvAppToPlatform } from 'src/deployment/env/cmds/deployEnvApp'
import { EnvConfig } from 'src/cli/config/Config'
import { DeployAppCmd, DeployConfigCmd } from 'src'
import { DeployEnvConfigToPlatform } from 'src/deployment/env/cmds/deployEnvConfig'

export const deployK8sApp = (
    cmd: DeployAppCmd,
    k8sOps: K8sDeployOps,
    ctx: Context
) => {
    ctx.createK8sDeployer(k8sOps).deployApp(cmd)
}

export const deployK8sConfig = (
    cmd: DeployConfigCmd,
    k8sOps: K8sDeployOps,
    ctx: Context
) => {
    ctx.createK8sDeployer(k8sOps).deployConfig(cmd)
}

// Env

const toK8sDeployOps = (cfg: EnvConfig): K8sDeployOps => ({
    dir: cfg.dir,
    cluster: cfg.target
})

export const deployEnvAppToK8s: DeployEnvAppToPlatform = (
    cmd: DeployAppCmd,
    cfg: EnvConfig,
    ctx: Context
) => {
    deployK8sApp(cmd, toK8sDeployOps(cfg), ctx)
}
export const deployEnvConfigToK8s: DeployEnvConfigToPlatform = (
    cmd: DeployConfigCmd,
    cfg: EnvConfig,
    ctx: Context
) => {
    deployK8sConfig(cmd, toK8sDeployOps(cfg), ctx)
}
