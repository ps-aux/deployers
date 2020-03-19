import { testDataDir } from 'src/_test'
import { readSopsFile } from 'src/fs/encryption/readSopsFile'
import { readFile } from 'src/fs/readFile'

// Not ready for running on CI
it('test', () => {
    const dir = testDataDir('encryption')

    const res = readSopsFile(dir + '/secret.env')
    expect(res).toBe(readFile(dir + '/secret.env.decrypted'))
})
