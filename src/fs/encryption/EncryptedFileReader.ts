import { readFile } from 'src/fs/readFile'
import { isSopsEncryptedFile } from 'src/fs/encryption/isSopsEncryptedFile'
import { readSopsFile } from 'src/fs/encryption/readSopsFile'
import { minimalLogger } from 'src/log/MinimalLogger'
import { Log } from 'src'
import { FilesReader } from 'src/fs/types'

export class EncryptedFileReader implements FilesReader {
    private readonly log: Log

    constructor(log?: Log) {
        this.log = log || minimalLogger()
    }

    read = (path: string): string => {
        const content = readFile(path)

        if (isSopsEncryptedFile(path, content)) {
            this.log.info(`File ${path} is encrypted. Will decrypt.`)
            return readSopsFile(path)
        }

        return content
    }
}
