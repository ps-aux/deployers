import { copyBetweenRepos } from 'src/docker/copyBetweenRepos'

it('works', () => {
    copyBetweenRepos(
        'docker.io/hello-world',
        'docker.io/abspro/hello-world-cp',
        'linux'
    )
})
