import {
    Config,
    FunctionVersionProvider,
    VersionProvider,
    VersionProviderType
} from 'src/cli/config/Config'
import { VersionDetector } from 'src'
import { createUrlVersionDetector } from 'src/version-detection/UrlVersionDetector'
import { appError } from 'src/error/AppError'
import { createFunctionVersionDetector } from 'src/version-detection/FunctionProviderVersionDetector'

const createVersionProviderVersionDetector = (
    prov: VersionProvider
): VersionDetector => {
    if (prov.type === VersionProviderType.URL) {
        const val = prov.value
        if (!val || typeof val !== 'string')
            throw appError(
                `'${VersionProviderType.URL}' version provider must be a nonempty string`
            )
        return createUrlVersionDetector(prov.value as string)
    }

    if (prov.type === VersionProviderType.FUNCTION) {
        const val = prov.value
        if (!val || typeof val !== 'function')
            throw appError(
                `'${VersionProviderType.FUNCTION}' version provider must be a function`
            )
        return createFunctionVersionDetector(
            prov.value as FunctionVersionProvider
        )
    }

    throw appError(`Invalid version provider: ${JSON.stringify(prov)}`)
}

const tryGetVersionDetectorFromEnvConfigs = (
    cfg: Config,
    env: string
): VersionDetector | null => {
    const envCfg = cfg.envs[env]

    if (!envCfg) return null

    const versionProvider = envCfg.versionProvider
    if (!versionProvider) return null

    return createVersionProviderVersionDetector(versionProvider)
}

const tryGetVersionDetectorFromVersionProvidersConfigs = (
    cfg: Config,
    env: string
): VersionDetector | null => {
    const provider = cfg.versionProviders[env]

    if (!provider) return null

    return createVersionProviderVersionDetector(provider)
}

export const createConfigVersionDetector = (
    cfg: Config,
    env: string
): VersionDetector => {
    let detector = tryGetVersionDetectorFromEnvConfigs(cfg, env)

    if (detector) return detector

    detector = tryGetVersionDetectorFromVersionProvidersConfigs(cfg, env)

    if (!detector) throw appError(`No version provider found for env ${env}`)

    return detector
}
