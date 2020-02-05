import entrypoint from 'src/cli/entrypoint'
import { createExecutionContext } from 'src/cli/ExecutionContext'
import { processConfig } from 'src/cli/config/Config'
import Path from 'path'
// @ts-ignore
import DockerDeployerModule from 'src/deployment/vps/DockerDeployer'

const cfg = processConfig(
    {
        envs: {
            foo: {
                type: 'vps',
                target: 'foo.com',
                dir: 'src/_test/deployment/DeploymentConfig/encrypted' // Dir must exist
            },
            bar: {
                type: 'vps',
                target: 'foo.com',
                dir: 'src/_test/deployment/DeploymentConfig/encrypted',
                copyFromRepo: 'eu.gcr.io/kubernetes-208711/new-firmaren-server'
            }
        }
    },
    Path.join(__dirname, '/../..')
)

jest.mock('src/deployment/vps/DockerDeployer', () => ({
    createDockerDeployer: () => ({})
}))

describe('env CLI', () => {
    // @ts-ignore
    process.exit = () => {
        console.log('not exiting')
    }

    const deployer = {
        deployApp: jest.fn(),
        deployConfig: jest.fn()
    }

    const ctx = createExecutionContext()
    ctx.config = () => cfg

    DockerDeployerModule.createDockerDeployer = () => deployer

    const testWasCalled = (command: string, mock: jest.Mock, args: any[]) =>
        it(`${command} calls`, () => {
            entrypoint(ctx).parse(command)

            expect(mock).toHaveBeenCalledTimes(1)
            expect(mock).toHaveBeenCalledWith(...args)

            mock.mockClear()
        })

    testWasCalled('env app 123 --env testxx', deployer.deployApp, [
        '123',
        {
            copyFromRepo: undefined
        }
    ])

    testWasCalled('env config --env test', deployer.deployConfig, [])
})
