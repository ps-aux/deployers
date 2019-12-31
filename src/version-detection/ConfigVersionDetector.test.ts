import { mockAxios } from 'src/_test/mock/mockAxios'
import { createConfigVersionDetector } from 'src/version-detection/ConfigVersionDetector'

// @ts-ignore
import cfgFile from '../../deployers.config'
import { Config } from 'src/cli/config/Config'

it('works', async () => {
    // Must be at the beginning
    mockAxios('http://version', 'get', {
        version: 'test-123'
    })

    const cfg = cfgFile as Config

    const foo = createConfigVersionDetector(cfg, 'foo')

    let version = await foo.getVersion()
    expect(version).toBe('foo-123')

    const test = createConfigVersionDetector(cfg, 'test')

    version = await test.getVersion()
    expect(version).toBe('test-123')
})
