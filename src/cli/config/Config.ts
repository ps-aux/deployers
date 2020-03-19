import { AxiosInstance } from 'axios'
import { ConfSchema } from 'src/cli/config/ConfigSchema'

export type Ssh = {
    user?: string
    port?: number
}

export const VersionProviderType = {
    URL: 'url',
    FUNCTION: 'function',
    all: ['url', 'function']
}

export type FunctionVersionProvider = (axios: AxiosInstance) => Promise<string>

export type VersionProvider = {
    type: 'url' | 'function'
    value: string | FunctionVersionProvider
}

export const DeploymentType = {
    VPS: 'vps',
    K8S: 'k8s',
    all: ['vps', 'k8s']
}

export type EnvConfig = {
    type: 'vps' | 'k8s'
    target: 'string' // either hostname in case of vps or k8s cluster name,
    dir: string
    ssh?: Ssh
    copyFromRepo?: string
    versionProvider?: VersionProvider
}

export type Config = {
    envs: { [key: string]: EnvConfig }
    versionProviders: { [key: string]: VersionProvider }
}

export const processConfig = (
    maybeCfg: object,
    normalizeDir: (s: string) => string
): Config => {
    const r = ConfSchema().validate(maybeCfg, {
        presence: 'required',
        allowUnknown: false
    })

    if (r.error) throw new Error('Invalid config.' + r.error.message)

    const cfg = maybeCfg as Config

    Object.values(cfg.envs).forEach(e => {
        e.dir = normalizeDir(e.dir)
    })

    return cfg as Config
}
