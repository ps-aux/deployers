import Yargs from 'yargs'
import { Context } from 'src/cli/Context'
import vpsCmd from 'src/cli/commands/vps'
import envCmd from 'src/cli/commands/env'
import k8sCmd from 'src/cli/commands/k8s'

const entrypoint = (ctx: Context) =>
    Yargs.scriptName('deploy')
        .usage('$0 <cmd> [args]')
        .command(vpsCmd(ctx))
        .command(envCmd(ctx))
        .command(k8sCmd(ctx))
        .alias('h', 'help')
        .help()
        // https://github.com/yargs/yargs/issues/895#issuecomment-392893305
        .demandCommand()
        .recommendCommands()
        .strict()

export default entrypoint
