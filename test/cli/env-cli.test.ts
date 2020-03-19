import { createContext } from 'src/cli/Context'
import Path from 'path'
import { expectCliInvoked } from 'test/cli/expectCliInvoked'
import { SshOpts } from 'src'
import { K8sDeployOps } from 'src/deployment/k8s/createK8sDeployer'

// @ts-ignore
// to detect fails
process.exit = () => {
    console.log('not exiting')
}

const createMockVpsDeployer = (
    expectedDir: string,
    expectedSshOpt: SshOpts
) => {
    const deployer = {
        deployApp: jest.fn(),
        deployConfig: jest.fn()
    }

    const ctx = createContext(__dirname)
    ctx.createVpsDeployer = (dir, sshOpts) => {
        expect(dir).toBe(Path.resolve(__dirname, expectedDir))
        expect(sshOpts).toEqual(expectedSshOpt)
        return deployer
    }

    return {
        testWasCalled: (command: string, mock: jest.Mock, args: any[]) =>
            it(`${command} calls vps deployer`, () => {
                expectCliInvoked(command, ctx, mock, args)
            }),
        deployer
    }
}

describe('foo env', () => {
    const { testWasCalled, deployer } = createMockVpsDeployer('foo-dir', {
        host: 'foo.com'
    })

    testWasCalled('env app 123 --env foo', deployer.deployApp, [
        {
            version: '123',
            copyFromRepo: undefined
        }
    ])

    testWasCalled('env config --env foo --restart', deployer.deployConfig, [
        { restart: true }
    ])
})

describe('bar env', () => {
    const { testWasCalled, deployer } = createMockVpsDeployer('bar-dir', {
        host: 'bar.com',
        user: 'bar-user',
        port: 123
    })

    testWasCalled('env app 444 --env bar', deployer.deployApp, [
        {
            version: '444',
            copyFromRepo: 'copy-from-repo-image'
        }
    ])

    testWasCalled('env config --env bar', deployer.deployConfig, [
        { restart: false }
    ])
})

const createMockK8sDeployer = (expectedOpts: K8sDeployOps) => {
    const deployer = {
        deployApp: jest.fn(),
        deployConfig: jest.fn()
    }

    const ctx = createContext(__dirname)
    ctx.createK8sDeployer = o => {
        expect(o).toEqual({
            ...expectedOpts,
            dir: Path.resolve(__dirname, expectedOpts.dir)
        })
        return deployer
    }

    return {
        testWasCalled: (command: string, mock: jest.Mock, args: any[]) =>
            it(`${command} calls k8s deployer`, () => {
                expectCliInvoked(command, ctx, mock, args)
            }),
        deployer
    }
}

describe('koo env', () => {
    const { testWasCalled, deployer } = createMockK8sDeployer({
        dir: 'koo-dir',
        cluster: 'koo-cluster'
    })

    testWasCalled('env app 444 --env koo', deployer.deployApp, [
        {
            version: '444'
        }
    ])

    testWasCalled('env config --env koo', deployer.deployConfig, [
        {
            restart: false
        }
    ])
})
