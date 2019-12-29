export type DeploymentCmdOpts = {
    host: string
    dir: string
    ssh?: {
        user?: string
        port?: number
    }
}
