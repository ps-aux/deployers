import { DeployAppCmd, DeployConfigCmd, Deployer, DoTemplate, Log } from 'src'
import { resolveRequiredDirFiles } from 'src/fs/dir/resolveDirFiles'
import Kubectl from 'src/k8s/kubectl/Kubectl'
import { FilesReader } from 'src/fs/types'
import { ContainerRepoSynchronizer } from 'src/deployment/container/ContainerRepoSynchronizer'
import { parseYaml } from 'src/fs/yaml/parseYaml'

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
        private repoSync: ContainerRepoSynchronizer,
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
        this.log.info('Deploying to k8s ee', cmd)

        const man = this.getDeploymentManifest(this.deploymentPath, cmd.version)

        const imageName = this.getImageNameFromManifestContent(man)
        // TODO duplicate functionality and code
        if (cmd.copyFromRepo) {
            this.repoSync.copyBetweenRepos(
                cmd.copyFromRepo,
                imageName,
                cmd.version
            )
        }

        this.kubectl.apply(man)
    }

    private getDeploymentManifest = (
        templatePath: string,
        version: string
    ): string => {
        return this.template(this.filesReader.read(templatePath), { version })
    }

    private getImageNameFromManifestContent = (content: string): string => {
        // TODO improve parsing
        const parsed = parseYaml(content)
        const containers = parsed.spec.template.spec.containers
        const image = containers[0].image

        if (!image.includes(':'))
            throw new Error(
                'Image in k8s deployment manifest doest not include ":"'
            )
        const imageName = image.split(':')[0]
        if (!imageName || typeof imageName !== 'string')
            throw new Error(
                'Could not parse image name from deployment manifest'
            )

        return imageName
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
