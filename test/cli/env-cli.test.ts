import { createContext } from 'src/cli/Context'
import Path from 'path'
import { expectCliInvoked } from 'test/cli/expectCliInvoked'
import { SshOpts } from 'src'

const createMockDockerDeployerCtx = (
    expectedDir: string,
    expectedSshOpt: SshOpts
) => {
    const deployer = {
        deployApp: jest.fn(),
        deployConfig: jest.fn()
    }

    const ctx = createContext(__dirname)
    ctx.createDockerDeployer = (dir, sshOpts) => {
        expect(dir).toBe(Path.resolve(__dirname, expectedDir))
        expect(sshOpts).toEqual(expectedSshOpt)
        return deployer
    }

    return {
        testWasCalled: (command: string, mock: jest.Mock, args: any[]) =>
            it(`${command} calls`, () => {
                expectCliInvoked(command, ctx, mock, args)
            }),
        deployer
    }
}

describe('foo env', () => {
    const { testWasCalled, deployer } = createMockDockerDeployerCtx('foo-dir', {
        host: 'foo.com'
    })

    testWasCalled('env app 123 --env foo', deployer.deployApp, [
        '123',
        {
            copyFromRepo: undefined
        }
    ])

    testWasCalled('env config --env foo --restart', deployer.deployConfig, [
        true
    ])
})

describe('bar env', () => {
    const { testWasCalled, deployer } = createMockDockerDeployerCtx('bar-dir', {
        host: 'bar.com',
        user: 'bar-user',
        port: 123
    })

    testWasCalled('env app 444 --env bar', deployer.deployApp, [
        '444',
        {
            copyFromRepo: 'copy-from-repo-image'
        }
    ])

    testWasCalled('env config --env bar', deployer.deployConfig, [false])
})
