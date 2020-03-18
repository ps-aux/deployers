import {
    resolveDirFiles,
    resolveRequiredDirFiles
} from 'src/fs/dir/resolveDirFiles'
import Path from 'path'

describe('resolveDirFiles', () => {
    const dir = __dirname

    it('works', () => {
        const r = resolveDirFiles(dir, [
            'resolveDirFiles.ts',
            'resolveDirFiles.spec.ts',
            'foo'
        ])

        expect(r).toEqual({
            'resolveDirFiles.ts': Path.resolve(dir, 'resolveDirFiles.ts'),
            'resolveDirFiles.spec.ts': Path.resolve(
                dir,
                'resolveDirFiles.spec.ts'
            ),
            foo: null
        })
    })

    it('throws exception when required file missing', () => {
        expect(() =>
            resolveRequiredDirFiles(dir, ['resolveDirFiles.ts', 'foo', 'bar'])
        ).toThrowError(`Dir ${dir} is expected to contain files: foo, bar`)
    })
})
