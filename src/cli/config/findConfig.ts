import Path from 'path'
import { existsSync } from 'fs'
import { Config, processConfig } from 'src/cli/config/Config'

const cfgFileName = 'deployers.config.js'

// TODO break down
export const findConfig = (
    rootDir: string,
    normalizeDir: (dir: string) => string
): Config | null => {
    // const cfgDir = getRootDir()

    const possibleCfgPath = Path.resolve(rootDir, cfgFileName)
    if (!existsSync(possibleCfgPath)) return null

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cfg = require(possibleCfgPath)
    return processConfig(cfg, normalizeDir)
}
