import { findFirstNpmDir } from 'src/cli/config/findFirstNpmDir'

it('works', () => {
    const res = findFirstNpmDir(
        '/home/user/foo/node_modules/baz/node_modules/lib/cli/bin.js'
    )

    expect(res).toBe('/home/user/foo/node_modules/baz')
})
