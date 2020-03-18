import { DeployAppOps, Deployer, DoTemplate } from 'src'
import { resolveRequiredDirFiles } from 'src/fs/dir/resolveDirFiles'
import Kubectl from 'src/k8s/kubectl/Kubectl'
import { readFile } from 'src/fs/readFile'

const configFile = 'config.yml'
const deploymentFile = 'deployment.yml'

export class K8sDeployer implements Deployer {
    private readonly configPath: string
    private readonly deploymentPath: string
    private readonly kubectl: Kubectl
    private readonly template: DoTemplate

    constructor(dir: string, kubectl: Kubectl, template: DoTemplate) {
        const files = resolveRequiredDirFiles(dir, [configFile, deploymentFile])
        this.configPath = files[configFile]
        this.deploymentPath = files[deploymentFile]
        this.kubectl = kubectl
        this.template = template
    }

    deployApp = (version: string, opts?: DeployAppOps) => {
        if (opts?.copyFromRepo)
            throw new Error(
                'App deployment with copyFromRepo not implemented yet '
            )
        const man = this.getDeploymentManifest(this.deploymentPath, version)

        this.kubectl.apply(man)
    }

    private getDeploymentManifest = (
        templatePath: string,
        version: string
    ): string => {
        return this.template(readFile(templatePath), { version })
    }

    deployConfig = (restart: boolean) => {
        if (restart)
            throw new Error(
                'Config deployment with restart not implemented yet'
            )

        const cfg = readFile(this.configPath)

        this.kubectl.apply(cfg)
    }
}
