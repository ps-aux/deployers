import { Argv, CommandModule } from 'yargs'
import { deployAppFromEnv } from 'src/deployment/cmds/deployApp'
import { deployConfigFromEnv } from 'src/deployment/cmds/deployConfig'
import { ExecutionContext } from 'src/cli/ExecutionContext'

const envCmd = (execCtx: ExecutionContext): CommandModule => ({
    command: 'env',
    describe: 'Deployment based on environment config',
    builder: (y: Argv) =>
        y
            .command(
                'app <app-version>', // We cannot use version as it is always boolean (probably conflicts with --version functionality)
                'Deploys given version of application',
                y => {
                    y.positional('app-version', {
                        type: 'string',
                        description: 'Version of app to be deployed'
                    })
                },
                args => {
                    deployAppFromEnv(
                        args.env as string,
                        args.appVersion as string,
                        execCtx
                    )
                }
            )
            .command('config', 'Deploys application config', {}, args => {
                deployConfigFromEnv(args.env as string, execCtx)
            })
            .options({
                env: {
                    demandOption: true,
                    type: 'string'
                }
            })
            .demandCommand(),
    handler: args => {
        throw new Error('Unexpected execution path')
    }
})

export default envCmd
