import { listDir } from 'src/fs/listDir'
import { DirFileItem } from 'src/fs/types'
import { fromPairs } from 'ramda'
import { readFile } from 'src/fs/readFile'

type Info = {
    name: string
}

export type DeploymentConfig = {
    info: Info
    srcDir: string
    envFilePath: string
    composeFilePath: string
}

const envFileName = '.env'
const composeFileName = 'docker-compose.yml'
const infoFileName = 'info.json'

const allowedFiles = [envFileName, composeFileName, infoFileName]

const parseInfo = (content: string): Info => {
    const data = JSON.parse(content)

    if (!data.name || typeof data.name !== 'string') {
        throw new Error('Invalid info file')
    }

    return data as Info
}

const filesAsMap = (files: DirFileItem[]): { [key: string]: DirFileItem } => {
    const err = new Error(
        `Deployment dir must contain exactly these files: ${allowedFiles}`
    )

    if (files.length !== allowedFiles.length) {
        throw err
    }

    const map = fromPairs(files.map(f => [f.localPath, f]))

    for (const f of allowedFiles) {
        if (!map[f]) throw err
    }

    return map
}

export const readDeploymentConfig = (dir: string): DeploymentConfig => {
    const files = listDir(dir)

    const fileMap = filesAsMap(files)

    return {
        info: parseInfo(readFile(fileMap[infoFileName].absPath)),
        srcDir: dir,
        envFilePath: fileMap[envFileName].absPath,
        composeFilePath: fileMap[composeFileName].absPath
    }
}
