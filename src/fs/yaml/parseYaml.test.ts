import { testDataDir } from 'src/_test'
import { readFile } from 'src/fs/readFile'
import { parseYaml } from 'src/fs/yaml/parseYaml'

it('works', () => {
    const dir = testDataDir('fs/yaml')
    const content = readFile(dir + '/foo.yaml')

    const res = parseYaml(content)

    console.log(res)
})
