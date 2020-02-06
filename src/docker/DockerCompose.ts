export type DockerComposeApi = {
    start: () => void
    restart: () => void
}

export type CmdExecutor = (cmd: string) => void

export class DockerCompose implements DockerComposeApi {
    private readonly cmdExecutor: CmdExecutor

    constructor(cmdExecutor: CmdExecutor) {
        this.cmdExecutor = cmdExecutor
    }

    restart = () => {
        this.cmdExecutor('docker-compose up -d --force-recreate')
    }

    start = () => {
        this.cmdExecutor('docker-compose up -d')
    }
}
