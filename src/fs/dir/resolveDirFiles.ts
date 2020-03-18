import Path from 'path'
import fs from 'fs'
import { ensureValidDir } from 'src/fs/dir/isValidDir'

export const resolveRequiredDirFiles = (dir: string, fileNames: string[]) =>
    resolveDirFiles(dir, fileNames, true) as { [key: string]: string }

export const resolveDirFiles = (
    dir: string,
    fileNames: string[],
    required?: boolean
): { [key: string]: string | null } => {
    if (!Path.isAbsolute(dir)) throw new Error('Dir path must be absolute')

    ensureValidDir(dir)

    // Create res object
    const res: { [key: string]: string | null } = {}
    fileNames.forEach(fn => (res[fn] = null))

    const files = fs.readdirSync(dir)

    files.forEach(f => {
        if (f in res) res[f] = Path.resolve(dir, f)
    })

    if (required) {
        const missing: string[] = []
        Object.entries(res).forEach(([key, val]) => {
            if (!val) missing.push(key)
        })
        if (missing.length)
            throw new Error(
                `Dir ${dir} is expected to contain files: ${missing.join(', ')}`
            )
    }

    return res
}
