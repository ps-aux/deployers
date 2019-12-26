import Path from 'path'

export const testDataDir = (dir: string): string => {
    let res = ''
    res = Path.join(__dirname, dir)

    return res
}
