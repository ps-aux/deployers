import { Argv } from 'yargs'
import { DeployConfigCmd } from 'src'

export const deployConfigCmd = {
    command: 'config',
    description: 'Deploy application config',
    builder: (y: Argv) =>
        y.option({
            restart: {
                type: 'boolean'
            }
        }),
    extractOps: (args: any): DeployConfigCmd => ({
        restart: (args.restart as boolean) || false
    })
}
