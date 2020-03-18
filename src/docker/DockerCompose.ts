import { ExecCmd } from 'src/cmd/typed'

export type DockerComposeApi = {
    start: () => void
    restart: () => void
}

export class DockerCompose implements DockerComposeApi {
    private readonly exec: ExecCmd

    constructor(exec: ExecCmd) {
        this.exec = exec
    }

    restart = () => {
        this.exec('docker-compose up -d --force-recreate')
    }

    start = () => {
        this.exec('docker-compose up -d')
    }
}
