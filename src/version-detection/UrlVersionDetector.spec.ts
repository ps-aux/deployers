import { mockAxios } from 'src/_test/mock/mockAxios'

import { createUrlVersionDetector } from 'src/version-detection/UrlVersionDetector'

it('works', async () => {
    const url = 'http://info'

    mockAxios(url, 'get', {
        version: '123'
    })

    const sut = createUrlVersionDetector(url)

    const ver = await sut.getVersion()

    expect(ver).toBe('123')
})
