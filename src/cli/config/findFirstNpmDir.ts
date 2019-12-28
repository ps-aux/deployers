const regex = /^(.*)\/node_modules\/.*$/

export const findFirstNpmDir = (path: string): string | null => {
    const res = path.match(regex)!

    if (!res) return null

    return res[1]
}
