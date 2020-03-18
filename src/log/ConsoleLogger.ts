import { Log } from 'src/types'

export class ConsoleLogger implements Log {
    debug = console.log

    info = console.log

    error = console.error
}
