import entrypoint from 'src/cli/entrypoint'
import { createContext } from 'src/cli/Context'
import { processConfig } from 'src/cli/config/Config'
import Path from 'path'

// Dir must exist
const dir = 'src/_test/deployment/DeploymentConfig/encrypted'

const cfg = processConfig(
    {
        envs: {
            foo: {
                type: 'vps',
                target: 'foo.com',
                dir
            },
            bar: {
                type: 'vps',
                target: 'foo.com',
                dir,
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

    const ctx = createContext()
    ctx.config = () => cfg
    ctx.createDockerDeployer = () => deployer

    const testWasCalled = (command: string, mock: jest.Mock, args: any[]) =>
        it(`${command} calls`, () => {
            entrypoint(ctx).parse(command)

            expect(mock).toHaveBeenCalledTimes(1)
            expect(mock).toHaveBeenCalledWith(...args)

            mock.mockClear()
        })

    testWasCalled('env app 123 --env foo', deployer.deployApp, [
        '123',
        {
            copyFromRepo: undefined
        }
    ])

    testWasCalled('env config --env bar', deployer.deployConfig, [false])

    testWasCalled('env config --env foo --restart', deployer.deployConfig, [
        true
    ])

    testWasCalled(
        'vps config --dir any --host any --restart',
        deployer.deployConfig,
        [true]
    )
})
