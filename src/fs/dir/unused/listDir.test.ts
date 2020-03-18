import { listDir } from 'src/fs/dir/unused/listDir'
import { DirFileItem } from 'src/fs/types'
import { testDataDir } from 'src/_test'

const expectPath = (f: DirFileItem, end: string) => {
    if (!f.absPath.startsWith('/')) {
        throw new Error(`Path ${f.absPath} is not absolute`)
    }
    if (f.localPath.startsWith('/')) {
        throw new Error(`Path ${f.localPath} is absolute`)
    }

    expect(f.localPath).toBe(end)

    if (!f.absPath.endsWith(end))
        throw new Error(`'${f.absPath}' does not end with '${end}'`)
}

it('works', () => {
    const dir = testDataDir('listDir')
    const r = listDir(dir)

    expectPath(r[0], 'a.txt')
    expectPath(r[1], 'd1/b.txt')
    expectPath(r[2], 'd1/d2/c.txt')
})
