import { Context } from 'src/cli/Context'
import { DeployConfigCmdOps } from 'src/cli/commands/deployConfigOptions'
import {
    createK8sDeployer,
    K8sDeployOps
} from 'src/deployment/k8s/cmds/createK8sDeployer'

export const deployK8sConfig = (
    cmdOps: DeployConfigCmdOps,
    k8sOps: K8sDeployOps,
    ctx: Context
) => {
    createK8sDeployer(k8sOps, ctx).deployConfig(!!cmdOps.restart)
}
