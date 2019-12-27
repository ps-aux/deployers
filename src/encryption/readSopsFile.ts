import { execSync } from 'child_process'

export const readSopsFile = (path: string): string => {
    const res = execSync(`sops --decrypt ${path}`)

    return res.toString()
}
