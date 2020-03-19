import {
    DeployAppCmd,
    DeployConfigCmd,
    Deployer,
    DoTemplate,
    LocalPath,
    Log,
    RemoteApi
} from 'src'
import {
    DeploymentConfig,
    readDeploymentConfig
} from 'src/deployment/vps/DockerDeploymentConfig'
import { parseComposeFile } from 'src/deployment/vps/parseComposeFile'
import { copyBetweenRepos } from 'src/docker/copyBetweenRepos'
import { DockerCompose, DockerComposeApi } from 'src/docker/DockerCompose'
import { minimalLogger } from 'src/log/MinimalLogger'
import { EncryptedFileReader } from 'src/fs/encryption/EncryptedFileReader'

const deploymentsRoot = 'deployments'

class DockerDeployer implements Deployer {
    readonly cfg: DeploymentConfig
    readonly remote: RemoteApi
    readonly remoteDir: string
    readonly log: Log
    readonly template: DoTemplate
    readonly deploymentLogInfo: string
    readonly compose: DockerComposeApi
    readonly filesReader: EncryptedFileReader

    constructor(
        dir: string,
        remoteApi: RemoteApi,
        template: DoTemplate,
        filesReader: EncryptedFileReader,
        log?: Log
    ) {
        this.cfg = readDeploymentConfig(dir)
        this.remote = remoteApi
        this.remoteDir = deploymentsRoot + '/' + this.cfg.info.name
        this.log = log || minimalLogger()
        this.template = template
        this.deploymentLogInfo = this.cfg.info.name
        this.filesReader = filesReader

        this.compose = new DockerCompose(cmd =>
            this.remote.execRemoteCmd(this.remoteDir, cmd)
        )
    }

    deployApp = (cmd: DeployAppCmd) => {
        const { version } = cmd
        this.log.info(
            `Deploying app. Deployment='${this.cfg.info.name}', Compose file=${this.cfg.composeFilePath}`
        )

        let content = this.filesReader.read(this.cfg.composeFilePath)

        const { imageName } = parseComposeFile(content)
        this.log.info(`Image=${imageName}, version=${version}`)

        if (cmd.copyFromRepo) {
            this.copyDockerImageBetweenRepo(
                cmd.copyFromRepo,
                imageName,
                version
            )
        }

        content = this.template(content, {
            version
        })
        this.deployFile('docker-compose.yml', content)

        this.compose.start()
        this.log.info(
            'New version of app deployed. Check if it is running properly'
        )
    }

    private copyDockerImageBetweenRepo(
        src: string,
        dst: string,
        version: string
    ) {
        this.log.info(`Will copy image '${dst}' from '${src}'`)
        copyBetweenRepos(src, dst, version)
    }

    deployConfig = (cmd: DeployConfigCmd) => {
        const envPath = this.cfg.envFilePath
        this.log.info(
            `Deploying config. Deployment='${this.cfg.info.name}', Config file=${envPath}`
        )

        const content = this.filesReader.read(envPath)

        this.deployFile('.env', content)

        if (cmd.restart) {
            this.log.info('Restarting app service')
            this.compose.restart()
        }
        this.log.info('Config deployed')
    }

    private deployFile = (path: LocalPath, content: string) => {
        this.log.info(`Deploying file '${path}'`)
        const dir = this.remoteDir
        this.remote.ensureDir(dir)
        this.remote.copyTextFile(dir, path, content)
    }
}

export default DockerDeployer
