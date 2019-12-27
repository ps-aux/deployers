import { template } from 'src/templating/engine/template'
import { readFile } from 'src/fs/readFile'
import Path from 'path'

it('works', () => {
    const tmpl = readFile(Path.join(__dirname, 'test', 'foo.template.txt'))
    const expected = readFile(Path.join(__dirname, 'test', 'foo.expected.txt'))

    const r = template(tmpl, { bar: 123, version: '123' })

    expect(r).toBe(expected)
})
