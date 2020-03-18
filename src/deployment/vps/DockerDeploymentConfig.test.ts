import { testDataDir } from 'src/_test'
import { readDeploymentConfig } from 'src/deployment/vps/DockerDeploymentConfig'

it('readDeploymentConfig', () => {
    const dir = testDataDir('deployment/vps/DeploymentConfig/valid')

    const conf = readDeploymentConfig(dir)

    expect(conf).toMatchObject({
        info: { name: 'foo' },
        srcDir: dir,
        envFilePath: dir + '/.env',
        composeFilePath: dir + '/docker-compose.yml'
    })
})
