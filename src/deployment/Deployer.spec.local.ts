import { createDeployer } from 'src/deployment/Deployer'
import { testDataDir } from 'src/_test'

const opts = {
    host: 'firmaren.garwan.io',
    user: 'ops'
}

const dir = testDataDir('deployment/DeploymentConfig/encrypted')

it('deploy config ', () => {
    const dep = createDeployer(dir, opts)

    dep.deployConfig()
})

it('deploy app ', () => {
    const dep = createDeployer(dir, opts)

    dep.deployApp('purple')
})
