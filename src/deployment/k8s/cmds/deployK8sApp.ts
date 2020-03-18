import { Context } from 'src/cli/Context'
import { DeployAppCmdOps } from 'src/cli/commands/deployAppOptions'
import {
    createK8sDeployer,
    K8sDeployOps
} from 'src/deployment/k8s/cmds/createK8sDeployer'

export const deployK8sApp = (
    cmdOps: DeployAppCmdOps,
    k8sOps: K8sDeployOps,
    ctx: Context
) => {
    createK8sDeployer(k8sOps, ctx).deployApp(cmdOps.version)
}
