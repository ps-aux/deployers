import { Argv, CommandModule } from 'yargs'
import { deployVpsApp } from 'src/deployment/vps/cmds/deployVpsApp'
import { absPath } from 'src/cli/pathResolver'
import { deployVpsConfig } from 'src/deployment/vps/cmds/deployVpsConfig'
import { Context } from 'src/cli/Context'
import { VpsDeployOps } from 'src/deployment/vps/types'
import { deployAppCmd } from 'src/cli/commands/deployAppOptions'
import { deployConfigCmd } from 'src/cli/commands/deployConfigOptions'

const extractOps = (args: any): VpsDeployOps => {
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

const vpsCmd = (execCtx: Context): CommandModule => ({
    command: 'vps',
    describe: 'VPS based deployment commands',
    builder: (y: Argv) =>
        y
            .command({
                ...deployAppCmd,
                handler: args => {
                    deployVpsApp(
                        deployAppCmd.extractOps(args),
                        extractOps(args),
                        execCtx
                    )
                }
            })
            .command({
                ...deployConfigCmd,
                handler: args => {
                    deployVpsConfig(
                        deployConfigCmd.extractOps(args),
                        extractOps(args),
                        execCtx
                    )
                }
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
