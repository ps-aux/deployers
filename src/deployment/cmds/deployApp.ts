import { DeploymentCmdOpts } from 'src/deployment/types'
import { createDeployer } from 'src/deployment/Deployer'
import { ExecutionContext } from 'src/cli/ExecutionContext'

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
