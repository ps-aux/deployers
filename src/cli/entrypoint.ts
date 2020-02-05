import Yargs from 'yargs'
import { ExecutionContext } from 'src/cli/ExecutionContext'
import vpsCmd from 'src/cli/commands/vps'
import envCmd from 'src/cli/commands/env'

const entrypoint = (ctx: ExecutionContext) =>
    Yargs.scriptName('deploy')
        .usage('$0 <cmd> [args]')
        .command(vpsCmd(ctx))
        .command(envCmd(ctx))
        .alias('h', 'help')
        .help()
        // https://github.com/yargs/yargs/issues/895#issuecomment-392893305
        .demandCommand()
        .recommendCommands()
        .strict()

export default entrypoint
