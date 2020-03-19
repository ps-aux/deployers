import Joi from '@hapi/joi'
import { DeploymentType, VersionProviderType } from 'src/cli/config/Config'

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

export const ConfSchema = () =>
    Joi.object({
        envs: Joi.object().pattern(Joi.string(), EnvConfigSchema()),
        versionProviders: Joi.object()
            .pattern(Joi.string(), VersionProviderSchema())
            .optional()
    })
