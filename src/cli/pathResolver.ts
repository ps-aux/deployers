import Path from 'path'

export const absPath = (path: string) => {
    return Path.resolve(path)
}
