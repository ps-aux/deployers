import { Argv, CommandModule } from 'yargs'
import { deployApp } from 'src/deployment/cmds/deployApp'
import { absPath } from 'src/cli/pathResolver'
import { deployConfig } from 'src/deployment/cmds/deployConfig'
import { ExecutionContext } from 'src/cli/ExecutionContext'

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
                        {
                            dir: absPath(args.dir as string),
                            host: args.host as string
                        },
                        execCtx,
                        args.copyFromRepo as string
                    )
                }
            )
            .command('config', 'Deploys application config', {}, args => {
                deployConfig(
                    {
                        dir: absPath(args.dir as string),
                        host: args.host as string
                    },
                    execCtx
                )
            })
            .options({
                dir: {
                    demandOption: true,
                    type: 'string'
                },
                host: {
                    demandOption: true,
                    type: 'string'
                }
            })
            .demandCommand(),
    handler: args => {
        throw new Error('Unexpected execution path')
    }
})

export default vpsCmd
