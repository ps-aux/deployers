import { testDataDir } from 'src/_test'
import { readFile } from 'src/fs/readFile'
import { parseYaml } from 'src/fs/yaml/parseYaml'

it('works', () => {
    const dir = testDataDir('fs/yaml')
    const content = readFile(dir + '/foo.yaml')

    const res = parseYaml(content)

    expect(res).toMatchObject({
        version: '3',
        services: {
            app: {
                image: 'gcr.io/kuar-demo/kuard-amd64:{{ version }}',
                ports: ['8081:8080', '8090:8080'],
                environment: {
                    // eslint-disable-next-line no-template-curly-in-string
                    FOO: '${FOO}'
                }
            }
        }
    })
})
