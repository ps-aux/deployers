import { DeployAppCmd, DeployConfigCmd, Deployer, DoTemplate, Log } from 'src'
import { resolveRequiredDirFiles } from 'src/fs/dir/resolveDirFiles'
import Kubectl from 'src/k8s/kubectl/Kubectl'
import { FilesReader } from 'src/fs/types'

const configFile = 'config.yml'
const deploymentFile = 'deployment.yml'

export class K8sDeployer implements Deployer {
    private readonly configPath: string
    private readonly deploymentPath: string
    private readonly kubectl: Kubectl
    private readonly template: DoTemplate
    private readonly filesReader: FilesReader
    private readonly log: Log

    constructor(
        dir: string,
        kubectl: Kubectl,
        template: DoTemplate,
        filesReader: FilesReader,
        log: Log
    ) {
        const files = resolveRequiredDirFiles(dir, [configFile, deploymentFile])
        this.configPath = files[configFile]
        this.deploymentPath = files[deploymentFile]
        this.kubectl = kubectl
        this.template = template
        this.filesReader = filesReader
        this.log = log
    }

    deployApp = (cmd: DeployAppCmd) => {
        this.log.info('Deploying to k8s', cmd)
        if (cmd.copyFromRepo)
            throw new Error(
                'App deployment with copyFromRepo not implemented yet '
            )
        const man = this.getDeploymentManifest(this.deploymentPath, cmd.version)

        this.kubectl.apply(man)
    }

    private getDeploymentManifest = (
        templatePath: string,
        version: string
    ): string => {
        return this.template(this.filesReader.read(templatePath), { version })
    }

    deployConfig = (cmd: DeployConfigCmd) => {
        this.log.info('Deploying  config to k8s', cmd)
        if (cmd.restart)
            throw new Error(
                'Config deployment with restart not implemented yet'
            )

        const cfg = this.filesReader.read(this.configPath)

        this.kubectl.apply(cfg)
    }
}
