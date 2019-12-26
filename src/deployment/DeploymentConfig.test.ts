import { testDataDir } from 'src/_test'
import { readDeploymentConfig } from 'src/deployment/DeploymentConfig'

it('readDeploymentConfig', () => {
    const dir = testDataDir('deployment/DeploymentConfig/valid')

    const conf = readDeploymentConfig(dir)

    expect(conf).toMatchObject({
        info: { name: 'foo' },
        dir,
        envFilePath: dir + '/.env',
        composeFilePath: dir + '/docker-compose.yml'
    })
})
