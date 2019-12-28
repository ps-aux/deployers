import Yargs from 'yargs'
import { createExecutionContext } from 'src/cli/ExecutionContext'
import vpsCmd from 'src/cli/commands/vps'
import envCmd from 'src/cli/commands/env'

const execCtx = createExecutionContext()

// 'argv' at the end is required
// eslint-disable-next-line no-unused-expressions
Yargs.scriptName('deploy')
    .usage('$0 <cmd> [args]')
    .command(vpsCmd(execCtx))
    .command(envCmd(execCtx))
    .alias('h', 'help')
    .help()
    // https://github.com/yargs/yargs/issues/895#issuecomment-392893305
    .demandCommand()
    .recommendCommands()
    .strict().argv
