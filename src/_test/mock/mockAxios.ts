/* eslint-disable import/first */
// eslint-disable-next-line no-undef
jest.mock('axios')
import { when } from 'jest-when'
import Axios from 'axios'

export const mockAxios = (url: string, method: string, response: object) => {
    // eslint-disable-next-line no-undef
    const m = jest.fn()

    when(m)
        .calledWith(url)
        .mockReturnValue(
            Promise.resolve({
                data: response
            })
        )

    // @ts-ignore
    Axios.create = () => ({ [method]: m })
}
