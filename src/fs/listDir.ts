import fs from 'fs'
import Path from 'path'
import { DirFileItem } from 'src/fs/types'

const handleError = (msg: string) => {
    throw new Error(msg)
}

export const listDir = (
    dirPath: string,
    pathPrefix?: string
): DirFileItem[] => {
    if (!dirPath.startsWith('/')) throw new Error('Dir path must be absolute')

    if (!fs.existsSync(dirPath)) handleError(`Path '${dirPath}' does not exist`)

    if (!fs.lstatSync(dirPath).isDirectory())
        handleError(`'${dirPath} is not a dir`)

    const res: DirFileItem[] = []
    const files = fs.readdirSync(dirPath)

    files.forEach(p => {
        const path = Path.join(dirPath, p)
        const stat = fs.lstatSync(path)

        const localPath = pathPrefix ? pathPrefix + '/' + p : p

        if (stat.isFile())
            res.push({
                absPath: path,
                localPath
            })
        else if (stat.isDirectory()) {
            listDir(path, localPath).forEach(df => res.push(df))
        }
    })

    return res
}
