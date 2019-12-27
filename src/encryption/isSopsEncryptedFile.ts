export const isSopsEncryptedFile = (path: string, content: string): boolean => {
    return content.includes('-----BEGIN PGP MESSAGE')
}
