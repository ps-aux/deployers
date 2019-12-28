import { execSync } from 'child_process'

export const copyBetweenRepos = (from: string, to: string, version: string) => {
    const src = from + ':' + version
    const dst = to + ':' + version

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
