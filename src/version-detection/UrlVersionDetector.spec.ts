import { mockAxios } from 'src/_test/mock/mockAxios'

import { createUrlVersionDetector } from 'src/version-detection/UrlVersionDetector'

it('works', async () => {
    const url = 'http://info'

    // 'version' prop name
    mockAxios([
        {
            url,
            method: 'get',
            response: {
                version: '123'
            }
        }
    ])

    let sut = createUrlVersionDetector(url)

    let ver = await sut.getVersion()

    expect(ver).toBe('123')

    mockAxios([
        {
            url,
            method: 'get',
            response: {
                VERSION: '456'
            }
        }
    ])

    // 'VERSION' prop name
    sut = createUrlVersionDetector(url)

    ver = await sut.getVersion()

    expect(ver).toBe('456')
})
