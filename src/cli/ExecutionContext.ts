import { Logger } from 'src/types'

export type ExecutionContext = {
    log: () => Logger
}

export const createExecutionContext = (): ExecutionContext => {
    return {
        // @ts-ignore
        log: () => console.log as Logger
    }
}
