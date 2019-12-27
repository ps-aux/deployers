import { isSopsEncryptedFile } from 'src/encryption/isSopsEncryptedFile'
import { testDataDir } from 'src/_test'
import { readFile } from 'src/fs/readFile'

const dir = testDataDir('encryption')

const assertIsEncrypted = (name: string) => {
    const r = isSopsEncryptedFile('any', readFile(dir + '/' + name))
    expect(r).toBe(true)
}

it('works', () => {
    assertIsEncrypted('secret.env')
    assertIsEncrypted('secret')
    assertIsEncrypted('secret.yml')
})
