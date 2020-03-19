#!/usr/bin/env node

import entrypoint from 'src/cli/entrypoint'
import { createContext } from 'src/cli/Context'
import { findFirstNpmDir } from 'src/cli/config/findFirstNpmDir'
import Path from 'path'

const getRootDir = (): string => {
    const npmDir = findFirstNpmDir(require!.main!.filename)

    if (npmDir) return npmDir
    return Path.resolve()
}

// eslint-disable-next-line no-unused-expressions
entrypoint(createContext(getRootDir())).argv
