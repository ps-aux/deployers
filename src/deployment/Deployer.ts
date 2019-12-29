import {
    DeployAppOpts,
    Deployer,
    DoTemplate,
    LocalPath,
    Logger,
    RemoteApi,
    SshOpts
} from 'src/types'
import { createSshApi } from 'src/remote/SshRemoteApi'
import {
    DeploymentConfig,
    readDeploymentConfig
} from 'src/deployment/DeploymentConfig'
import { readFile } from 'src/fs/readFile'
import { template } from 'src/templating/engine/template'
import { isSopsEncryptedFile } from 'src/encryption/isSopsEncryptedFile'
import { readSopsFile } from 'src/encryption/readSopsFile'
import { parseComposeFile } from 'src/deployment/parseComposeFile'
import { copyBetweenRepos } from 'src/docker/copyBetweenRepos'

type FsDeployerOpts = {
    log?: Logger
}

const deploymentsRoot = 'deployments'

class FsDeployer implements Deployer {
    readonly cfg: DeploymentConfig
    readonly remote: RemoteApi
    readonly remoteDir: string
    readonly log: Logger
    readonly template: DoTemplate
    readonly deploymentLogInfo: string

    constructor(
        dir: string,
        remoteApi: RemoteApi,
        template: DoTemplate,
        opts: FsDeployerOpts = {}
    ) {
        this.cfg = readDeploymentConfig(dir)
        this.remote = remoteApi
        this.remoteDir = deploymentsRoot + '/' + this.cfg.info.name
        this.log = opts.log || (() => undefined)
        this.template = template
        this.deploymentLogInfo = this.cfg.info.name
    }

    deployApp = (version: string, opts: DeployAppOpts = {}) => {
        this.log(
            `Deploying app. Deployment='${this.cfg.info.name}', Compose file=${this.cfg.composeFilePath}`
        )

        let content = readFile(this.cfg.composeFilePath)

        const { imageName } = parseComposeFile(content)
        this.log(`Image=${imageName}, version=${version}`)

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

        this.composeUp()
        this.log('New version of app deployed. Check if it is running properly')
    }

    private copyDockerImageBetweenRepo(
        src: string,
        dst: string,
        version: string
    ) {
        this.log(`Will copy image '${dst}' from '${src}'`)
        copyBetweenRepos(src, dst, version)
    }

    deployConfig = (restartApp?: boolean) => {
        const envPath = this.cfg.envFilePath
        this.log(
            `Deploying config. Deployment='${this.cfg.info.name}', Config file=${envPath}`
        )

        let content = readFile(envPath)

        if (isSopsEncryptedFile(envPath, content)) {
            content = readSopsFile(envPath)
            this.log('File is encrypted. Will delegate to SOPS to decrypt. ')
        }

        this.deployFile('.env', content)

        if (restartApp) {
            this.log('Reloading app service')
            this.composeUp()
        }
        this.log('Config deployed')
    }

    private composeUp = () => {
        this.remote.execRemoteCmd(this.remoteDir, 'docker-compose up -d')
    }

    private deployFile = (path: LocalPath, content: string) => {
        this.log(`Deploying file '${path}'`)
        const dir = this.remoteDir
        this.remote.ensureDir(dir)
        this.remote.copyTextFile(dir, path, content)
    }
}

export const createDeployer = (
    srcDir: string,
    sshOpts: SshOpts,
    log?: Logger
): Deployer => {
    const remoteApi = createSshApi({
        ssh: sshOpts,
        log
    })
    return new FsDeployer(srcDir, remoteApi, template, {
        log
    })
}
