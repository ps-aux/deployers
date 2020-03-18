import {
    DeployAppOps,
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
import { readFile } from 'src/fs/readFile'
import { isSopsEncryptedFile } from 'src/encryption/isSopsEncryptedFile'
import { readSopsFile } from 'src/encryption/readSopsFile'
import { parseComposeFile } from 'src/deployment/vps/parseComposeFile'
import { copyBetweenRepos } from 'src/docker/copyBetweenRepos'
import { DockerCompose, DockerComposeApi } from 'src/docker/DockerCompose'
import { minimalLogger } from 'src/log/MinimalLogger'

const deploymentsRoot = 'deployments'

class DockerDeployer implements Deployer {
    readonly cfg: DeploymentConfig
    readonly remote: RemoteApi
    readonly remoteDir: string
    readonly log: Log
    readonly template: DoTemplate
    readonly deploymentLogInfo: string
    readonly compose: DockerComposeApi

    constructor(
        dir: string,
        remoteApi: RemoteApi,
        template: DoTemplate,
        log?: Log
    ) {
        this.cfg = readDeploymentConfig(dir)
        this.remote = remoteApi
        this.remoteDir = deploymentsRoot + '/' + this.cfg.info.name
        this.log = log || minimalLogger()
        this.template = template
        this.deploymentLogInfo = this.cfg.info.name

        this.compose = new DockerCompose(cmd =>
            this.remote.execRemoteCmd(this.remoteDir, cmd)
        )
    }

    deployApp = (version: string, opts: DeployAppOps = {}) => {
        this.log.info(
            `Deploying app. Deployment='${this.cfg.info.name}', Compose file=${this.cfg.composeFilePath}`
        )

        let content = readFile(this.cfg.composeFilePath)

        const { imageName } = parseComposeFile(content)
        this.log.info(`Image=${imageName}, version=${version}`)

        if (opts.copyFromRepo) {
            this.copyDockerImageBetweenRepo(
                opts.copyFromRepo,
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

    deployConfig = (restartApp?: boolean) => {
        const envPath = this.cfg.envFilePath
        this.log.info(
            `Deploying config. Deployment='${this.cfg.info.name}', Config file=${envPath}`
        )

        let content = readFile(envPath)

        if (isSopsEncryptedFile(envPath, content)) {
            content = readSopsFile(envPath)
            this.log.info(
                'File is encrypted. Will delegate to SOPS to decrypt. '
            )
        }

        this.deployFile('.env', content)

        if (restartApp) {
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
