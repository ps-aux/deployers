import { createContext } from 'src/cli/Context'
import { expectCliInvoked } from 'test/cli/expectCliInvoked'
import Path from 'path'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// to detect fails
process.exit = () => {
    console.log('not exiting')
}

describe('env CLI', () => {
    const deployer = {
        deployApp: jest.fn(),
        deployConfig: jest.fn()
    }

    const ctx = createContext(__dirname)
    ctx.createVpsDeployer = (dir, sshOpts) => {
        expect(dir).toBe(Path.resolve(__dirname, 'my-dir'))
        expect(sshOpts).toEqual({
            host: 'my-host',
            user: 'my-user',
            port: 1234
        })
        return deployer
    }

    const testWasCalled = (command: string, mock: jest.Mock, args: any[]) =>
        it(`${command} calls`, () => {
            expectCliInvoked(command, ctx, mock, args)
        })

    testWasCalled(
        'vps config --dir my-dir --host my-host --ssh--port 1234 --ssh-user=my-user --restart',
        deployer.deployConfig,
        [
            {
                restart: true
            }
        ]
    )
})
