import { parseYaml } from 'src/fs/yaml/parseYaml'

const imageRegex = /^.*:{{ ?version ?}}$/

export type ComposeDef = {
    imageName: string
}

export const parseComposeFile = (content: string): ComposeDef => {
    const compose = parseYaml(content)

    const services = Object.values(compose.services)

    if (services.length !== 1)
        throw new Error('Compose file must contain exactly one service')

    const service = services[0] as any

    const image = service.image

    if (!image.match(imageRegex))
        throw new Error(
            'Compose file service image must have template param :{{ version }}'
        )

    const imageName = image.split(':')[0]

    return {
        imageName
    }
}
