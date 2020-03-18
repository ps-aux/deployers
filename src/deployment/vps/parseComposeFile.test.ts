import { testDataDir } from 'src/_test'
import { readFile } from 'src/fs/readFile'
import { parseComposeFile } from 'src/deployment/vps/parseComposeFile'

const dir = testDataDir('deployment/vps/parseComposeFile')

const contentOf = (name: string) => readFile(dir + '/' + name)

const expectError = (fileName: string, msg: string) => {
    expect(() => parseComposeFile(contentOf(fileName))).toThrow(msg)
}

it('works', () => {
    const def = parseComposeFile(contentOf('valid.yml'))

    expect(def.imageName).toBe('gcr.io/kuar-demo/kuard-amd64')
})

it('version param is required', () => {
    expectError(
        'compose-without-version-param.yml',
        'Compose file service image must have template param :{{ version }}'
    )
})

it('exactly one service is required', () => {
    expectError(
        'compose-with-more-services.yml',
        'Compose file must contain exactly one service'
    )
})
