import { Logger } from 'src/types'
import { Config, EnvConfig } from 'src/cli/config/Config'
import { findConfig } from 'src/cli/config/findConfig'

export type ExecutionContext = {
    log: () => Logger
    config: () => Config
    envConfig: (env: string) => EnvConfig
}

export const createExecutionContext = (): ExecutionContext => {
    const config = () => {
        const cfg = findConfig()

        if (!cfg) throw new Error('No user config present')

        return cfg
    }

    return {
        // @ts-ignore
        log: () => console.log as Logger,

        config,

        envConfig: (env: string) => {
            // @ts-ignore
            const cfg: Config = config()

            const envCfg = cfg.envs[env]

            if (!envCfg) throw new Error(`No config for env '${env}'`)

            return envCfg
        }
    }
}
