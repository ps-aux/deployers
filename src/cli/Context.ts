import { Deployer, Log, SshOpts } from 'src/types'
import { Config, EnvConfig } from 'src/cli/config/Config'
import { findConfig } from 'src/cli/config/findConfig'
import { createSshApi } from 'src/cmd/remote/SshRemoteApi'
import { template } from 'src/templating/engine/template'
import DockerDeployer from 'src/deployment/vps/DockerDeployer'
import { ConsoleLogger } from 'src/log/ConsoleLogger'
import Path from 'path'
import {
    createK8sDeployer,
    K8sDeployOps
} from 'src/deployment/k8s/createK8sDeployer'
import { EncryptedFileReader } from 'src/fs/encryption/EncryptedFileReader'

export type Context = {
    log: () => Log
    config: () => Config
    normalizeDir: (dir: string) => string
    envConfig: (env: string) => EnvConfig
    createVpsDeployer: (srcDir: string, sshOpts: SshOpts) => Deployer
    createK8sDeployer: (ops: K8sDeployOps) => Deployer
    filesReader: () => EncryptedFileReader
}

class ContextImpl implements Context {
    private readonly _log: Log
    private readonly rootDir: string

    constructor(rootDir: string) {
        this._log = new ConsoleLogger()
        this.rootDir = rootDir
    }

    config = () => {
        const cfg = findConfig(this.rootDir, this.normalizeDir)

        if (!cfg) throw new Error('No user config present')

        return cfg
    }

    normalizeDir = (dir: string) => Path.resolve(this.rootDir, dir)

    envConfig = (env: string) => {
        // @ts-ignore
        const cfg: Config = this.config()

        const envCfg = cfg.envs[env]

        if (!envCfg) throw new Error(`No config for env '${env}'`)

        return envCfg
    }

    createVpsDeployer = (srcDir: string, sshOpts: SshOpts) => {
        const remoteApi = createSshApi({
            ssh: sshOpts,
            log: this.log()
        })

        return new DockerDeployer(
            srcDir,
            remoteApi,
            template,
            this.filesReader(),
            this.log()
        )
    }

    createK8sDeployer = (ops: K8sDeployOps) => {
        const d = createK8sDeployer(ops, this)
        return d
    }

    log = () => this._log

    filesReader = () => new EncryptedFileReader(this.log())
}

export const createContext = (rootDir: string): Context => {
    return new ContextImpl(rootDir)
}
