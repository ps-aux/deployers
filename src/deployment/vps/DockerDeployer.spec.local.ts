import { createDockerDeployer } from 'src/deployment/vps/DockerDeployer'
import { testDataDir } from 'src/_test'

const opts = {
    host: 'firmaren.garwan.io',
    user: 'ops'
}

const dir = testDataDir('deployment/DeploymentConfig/encrypted')

it('deploy config ', () => {
    const dep = createDockerDeployer(dir, opts)

    dep.deployConfig()
})

it('deploy app ', () => {
    const dep = createDockerDeployer(dir, opts)

    dep.deployApp('purple')
})
