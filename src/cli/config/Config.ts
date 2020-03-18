import Joi from '@hapi/joi'
import { ensureValidDir } from 'src/fs/dir/isValidDir'
import Path from 'path'
import { AxiosInstance } from 'axios'

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

const VersionProviderSchema = () =>
    Joi.object({
        type: Joi.string().equal(
            VersionProviderType.URL,
            VersionProviderType.FUNCTION
        ),
        value: [Joi.string(), Joi.function()]
    })

const SshSchema = () =>
    Joi.object({
        user: Joi.string().optional(),
        port: Joi.number().optional()
    })

const EnvConfigSchema = () =>
    Joi.object({
        type: Joi.string().equal(DeploymentType.VPS),
        target: Joi.string(),
        dir: Joi.string(),
        ssh: SshSchema().optional(),
        copyFromRepo: Joi.string().optional(),
        versionProvider: VersionProviderSchema().optional()
    })

const ConfSchema = () =>
    Joi.object({
        envs: Joi.object().pattern(Joi.string(), EnvConfigSchema()),
        versionProviders: Joi.object()
            .pattern(Joi.string(), VersionProviderSchema())
            .optional()
    })

export const processConfig = (maybeCfg: object, rootDir: string): Config => {
    const r = ConfSchema().validate(maybeCfg, {
        presence: 'required',
        allowUnknown: false
    })

    if (r.error) throw new Error('Invalid config.' + r.error.message)

    const cfg = maybeCfg as Config

    Object.values(cfg.envs).forEach(e => {
        if (!Path.isAbsolute(e.dir)) {
            e.dir = rootDir + '/' + e.dir
        }
        ensureValidDir(e.dir)
    })

    return cfg as Config
}
