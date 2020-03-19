import { Argv } from 'yargs'
import { DeployAppCmd } from 'src'

export const deployAppCmd = {
    command: 'app <app-version>',
    description: 'Deploys given version of application',
    builder: (y: Argv) =>
        y
            .positional('appVersion', {
                type: 'string',
                description: 'Version of app to be deployed'
            })
            .option({
                copyFromRepo: {
                    type: 'string'
                }
            }),
    extractOps: (args: any): DeployAppCmd => ({
        version: args.appVersion as string,
        copyFromRepo: args.copyFromRepo as string
    })
}
