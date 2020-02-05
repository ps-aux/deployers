import { Argv, CommandModule } from 'yargs'
import {
    deployEnvApp,
    deployEnvAppBasedOnEnv
} from 'src/deployment/vps/cmds/deployApp'
import { deployConfigFromEnv } from 'src/deployment/vps/cmds/deployConfig'
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
                    deployEnvApp(
                        args.env as string,
                        args.appVersion as string,
                        execCtx
                    )
                }
            )
            .command(
                'app:from <from-env>',
                'Deploys a version of application based on a current version at the given env',
                y => {
                    y.positional('from-env', {
                        type: 'string',
                        description:
                            'Env from which to the detect current version'
                    })
                },
                args => {
                    deployEnvAppBasedOnEnv(
                        args.env as string,
                        args.fromEnv as string,
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
