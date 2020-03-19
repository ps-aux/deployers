import { mockAxios } from 'src/_test/mock/mockAxios'

import { createConfigVersionDetector } from 'src/version-detection/ConfigVersionDetector'

// @ts-ignore
import cfgFile from 'test/cli/deployers.config'
import { Config } from 'src/cli/config/Config'
// Must be at the beginning
mockAxios([
    {
        method: 'get',
        url: 'http://version',
        response: {
            version: 'test-123'
        }
    },
    {
        method: 'get',
        url: 'https://version.bar',
        response: {
            version: 'bar-123'
        }
    }
])

it('works', async () => {
    const cfg = cfgFile as Config

    const foo = createConfigVersionDetector(cfg, 'foo')

    let version = await foo.getVersion()
    expect(version).toBe('foo-123')

    const test = createConfigVersionDetector(cfg, 'bar')

    version = await test.getVersion()
    expect(version).toBe('bar-123')
})
