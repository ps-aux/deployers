import { Context } from 'src/cli/Context'
import { K8sDeployer } from 'src/deployment/k8s/K8sDeployer'
import Kubectl from 'src/k8s/kubectl/Kubectl'
import { LocalShellCmdExecutor } from 'src/cmd/LocalShellCmdExecutor'
import { template } from 'src/templating/engine/template'
import { ContainerRepoSynchronizer } from 'src/deployment/container/ContainerRepoSynchronizer'

export type K8sDeployOps = {
    dir: string
    cluster: string
}

export const createK8sDeployer = (
    ops: K8sDeployOps,
    ctx: Context
): K8sDeployer => {
    const d = new K8sDeployer(
        ops.dir,
        new Kubectl(ops.cluster, new LocalShellCmdExecutor()),
        template,
        ctx.filesReader(),
        new ContainerRepoSynchronizer(ctx.log()),
        ctx.log()
    )

    return d
}
