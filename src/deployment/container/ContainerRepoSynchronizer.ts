import { execSync } from 'child_process'
import { Log } from 'src'

export class ContainerRepoSynchronizer {
    constructor(private log: Log) {}

    copyBetweenRepos = (from: string, to: string, version: string) => {
        const src = from + ':' + version
        const dst = to + ':' + version
        this.log.info(`Will copy image '${dst}' from '${src}'`)

        execSync(`docker pull ${src}`, {
            stdio: 'inherit'
        })

        execSync(`docker tag ${src} ${dst}`, {
            stdio: 'inherit'
        })

        execSync(`docker push ${dst}`, {
            stdio: 'inherit'
        })
    }
}
