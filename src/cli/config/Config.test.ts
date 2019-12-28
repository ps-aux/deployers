import { processConfig } from 'src/cli/config/Config'

describe('processConfig', () => {
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
        processConfig(valid(), __dirname)
    })

    it('bad schema detected', () => {
        const input = valid()

        delete input.envs.foo.type

        expect(() => processConfig(input, __dirname)).toThrowError(
            'Invalid config."envs.foo.type" is required'
        )
    })

    it('bad dir detected', () => {
        const input = valid()

        input.envs.foo.dir = 'non-existent'

        expect(() => processConfig(input, __dirname)).toThrowError(
            `${__dirname}/non-existent is not a directory`
        )
    })
})
