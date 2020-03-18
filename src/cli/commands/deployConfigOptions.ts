import { Argv } from 'yargs'

export type DeployConfigCmdOps = {
    restart?: boolean
}

export const deployConfigCmd = {
    command: 'config',
    description: 'Deploy application config',
    builder: (y: Argv) =>
        y.option({
            restart: {
                type: 'boolean'
            }
        }),
    extractOps: (args: any): DeployConfigCmdOps => ({
        restart: args.restart as boolean
    })
}
