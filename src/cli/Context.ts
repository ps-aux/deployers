import { Deployer, Log, SshOpts } from 'src/types'
import { Config, EnvConfig } from 'src/cli/config/Config'
import { findConfig } from 'src/cli/config/findConfig'
import { createSshApi } from 'src/cmd/remote/SshRemoteApi'
import { template } from 'src/templating/engine/template'
import DockerDeployer from 'src/deployment/vps/DockerDeployer'
import { ConsoleLogger } from 'src/log/ConsoleLogger'

export type Context = {
    log: () => Log
    config: () => Config
    envConfig: (env: string) => EnvConfig
    createDockerDeployer: (srcDir: string, sshOpts: SshOpts) => Deployer
}

class ContextImpl implements Context {
    private readonly _log: Log

    constructor() {
        this._log = new ConsoleLogger()
    }

    config = () => {
        const cfg = findConfig()

        if (!cfg) throw new Error('No user config present')

        return cfg
    }

    envConfig = (env: string) => {
        // @ts-ignore
        const cfg: Config = this.config()

        const envCfg = cfg.envs[env]

        if (!envCfg) throw new Error(`No config for env '${env}'`)

        return envCfg
    }

    createDockerDeployer = (srcDir: string, sshOpts: SshOpts) => {
        const remoteApi = createSshApi({
            ssh: sshOpts,
            log: this.log()
        })

        return new DockerDeployer(srcDir, remoteApi, template, this.log())
    }

    log = () => this._log
}

export const createContext = (): Context => {
    return new ContextImpl()
}
