/* eslint-disable import/first */
// eslint-disable-next-line no-undef

// eslint-disable-next-line no-undef
jest.mock('axios')
import { when } from 'jest-when'
import Axios from 'axios'

export const mockAxios = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    defs: { url: string; method: string; response: object }[]
) => {
    // TODO
    // eslint-disable-next-line no-undef
    const mocks: { [method: string]: jest.Mock } = {}

    defs.forEach((d) => {
        let m = mocks[d.method]
        if (!m) {
            // eslint-disable-next-line no-undef
            m = jest.fn()
            mocks[d.method] = m
        }

        when(m)
            .calledWith(d.url)
            .mockReturnValue(
                Promise.resolve({
                    data: d.response
                })
            )
    })

    // @ts-ignore
    Axios.create = () => mocks
}
