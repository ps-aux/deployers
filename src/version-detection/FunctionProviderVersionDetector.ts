import Axios from 'axios'
import { appError } from 'src/error/AppError'
import { VersionDetector } from 'src'
import { FunctionVersionProvider } from 'src/cli/config/Config'

export const createFunctionVersionDetector = (
    fun: FunctionVersionProvider
): VersionDetector => {
    const http = Axios.create()

    const getVersion = async () => {
        const res = await fun(http)

        // noinspection SuspiciousTypeOfGuard
        if (!res || typeof res !== 'string')
            throw appError(
                `Version returned from custom version provider must be a non empty string. Instead it is: '${res}'`
            )

        return res
    }

    return {
        getVersion
    }
}
