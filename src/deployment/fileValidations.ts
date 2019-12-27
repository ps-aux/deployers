export const ensureValidComposeFile = (content: string) => {
    if (!content.includes(':{{ version }}'))
        throw new Error('Compose file must be a template with ":{{ version }}"')
}
