import { readFile } from 'src/fs/readFile'
import { resolveRequiredDirFiles } from 'src/fs/dir/resolveDirFiles'

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

const parseInfo = (content: string): Info => {
    const data = JSON.parse(content)

    if (!data.name || typeof data.name !== 'string') {
        throw new Error('Invalid info file')
    }

    return data as Info
}

export const readDeploymentConfig = (dir: string): DeploymentConfig => {
    const files = resolveRequiredDirFiles(dir, [
        envFileName,
        composeFileName,
        infoFileName
    ])

    return {
        info: parseInfo(readFile(files[infoFileName])),
        srcDir: dir,
        envFilePath: files[envFileName],
        composeFilePath: files[composeFileName]
    }
}
