import { Argv, CommandModule } from 'yargs'
import { deployApp } from 'src/deployment/cmds/deployApp'
import { absPath } from 'src/cli/pathResolver'
import { deployConfig } from 'src/deployment/cmds/deployConfig'
import { ExecutionContext } from 'src/cli/ExecutionContext'
import { DeploymentCmdOpts } from 'src/deployment/types'

const extractArgs = (args: any): DeploymentCmdOpts => {
    const res = {
        dir: absPath(args.dir as string),
        host: args.host as string,
        ssh: {
            user: args.sshUser as string,
            port: args.sshPort as number
        }
    }

    if (res.ssh.port != null && isNaN(res.ssh.port))
        throw new Error('Invalid SSH port number')
    return res
}

const vpsCmd = (execCtx: ExecutionContext): CommandModule => ({
    command: 'vps',
    describe: 'VPS based deployment',
    builder: (y: Argv) =>
        y
            .command(
                'app <app-version>', // We cannot use version as it is always boolean (probably conflicts with --version functionality)
                'Deploys given version of application',
                y => {
                    y.positional('appVersion', {
                        type: 'string',
                        description: 'Version of app to be deployed'
                    })

                    y.option({
                        copyFromRepo: {
                            type: 'string'
                        }
                    })
                },
                args => {
                    deployApp(
                        args.appVersion as string,
                        extractArgs(args),
                        execCtx,
                        args.copyFromRepo as string
                    )
                }
            )
            .command('config', 'Deploys application config', {}, args => {
                deployConfig(extractArgs(args), execCtx)
            })
            .options({
                dir: {
                    demandOption: true,
                    type: 'string'
                },
                host: {
                    demandOption: true,
                    type: 'string'
                },
                'ssh-user': {
                    type: 'string'
                },
                'ssh-port': {
                    type: 'number'
                }
            })
            .demandCommand(),
    handler: args => {
        throw new Error('Unexpected execution path')
    }
})

export default vpsCmd