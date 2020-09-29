import { Argv, CommandModule } from 'yargs'
import { Context } from 'src/cli/Context'
import { deployConfigCmd } from 'src/cli/commands/deployConfigOptions'
import { deployAppCmd } from 'src/cli/commands/deployAppOptions'
import {
    deployEnvApp,
    deployEnvAppVersionFromOtherEnv
} from 'src/deployment/env/cmds/deployEnvApp'
import { deployEnvConfig } from 'src/deployment/env/cmds/deployEnvConfig'

const envCmd = (ctx: Context): CommandModule => ({
    command: 'env',
    describe: 'Deployment based on environment config',
    builder: (y: Argv) =>
        y
            .command(
                deployAppCmd.command,
                deployAppCmd.description,
                (y) => {
                    y.positional('app-version', {
                        type: 'string',
                        description: 'Version of app to be deployed'
                    })
                },
                (args) => {
                    deployEnvApp(
                        args.env as string,
                        args.appVersion as string,
                        ctx
                    )
                }
            )
            .command(
                'app:from <from-env>',
                'Deploys a version of application based on a current version at the given env',
                (y) => {
                    y.positional('from-env', {
                        type: 'string',
                        description:
                            'Env from which to the detect current version'
                    })
                },
                async (args) =>
                    deployEnvAppVersionFromOtherEnv(
                        args.env as string,
                        args.fromEnv as string,
                        ctx
                    )
            )
            .command({
                ...deployConfigCmd,
                handler: (args) => {
                    deployEnvConfig(
                        deployConfigCmd.extractOps(args),
                        args.env as string,
                        ctx
                    )
                }
            })
            .options({
                env: {
                    demandOption: true,
                    type: 'string'
                }
            })
            .demandCommand(),
    handler: (args) => {
        throw new Error('Unexpected execution path')
    }
})

export default envCmd
