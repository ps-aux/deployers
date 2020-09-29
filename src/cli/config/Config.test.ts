import { processConfig } from 'src/cli/config/Config'
import Path from 'path'

describe('processConfig', () => {
    const normalize = (d: string) => Path.resolve(__dirname, d)

    const valid = () => ({
        envs: {
            foo: {
                type: 'vps',
                target: 'some.host',
                dir: '../config'
            }
        }
    })

    it('valid', () => {
        processConfig(valid(), normalize)
    })

    it('bad schema detected', () => {
        const input = valid()

        // @ts-ignore
        delete input.envs.foo.type

        expect(() => processConfig(input, normalize)).toThrowError(
            'Invalid config."envs.foo.type" is required'
        )
    })
})
