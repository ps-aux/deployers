import { findFirstNpmDir } from 'src/cli/config/findFirstNpmDir'
import Path from 'path'
import { existsSync } from 'fs'
import { Config, processConfig } from 'src/cli/config/Config'

const getRootDir = (): string => {
    const npmDir = findFirstNpmDir(require!.main!.filename)

    if (npmDir) return npmDir
    return Path.resolve()
}

const cfgFileName = 'deployers.config.js'

export const findConfig = (): Config | null => {
    const cfgDir = getRootDir()

    const possibleCfgPath = Path.resolve(cfgDir, cfgFileName)
    if (!existsSync(possibleCfgPath)) return null

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cfg = require(possibleCfgPath)
    return processConfig(cfg, cfgDir)
}
