export type VpsDeployOps = {
    host: string
    dir: string
    ssh?: {
        user?: string
        port?: number
    }
}
