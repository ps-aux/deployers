// @ts-ignore
import yaml from 'js-yaml'

export const parseYaml = (content: string) => {
    return yaml.safeLoad(content)
}
