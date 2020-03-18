import { LocalShellCmdExecutor } from 'src/cmd/LocalShellCmdExecutor'

class Kubectl {
    private readonly cmd: LocalShellCmdExecutor
    private readonly cluster: string

    constructor(cluster: string, cmd: LocalShellCmdExecutor) {
        this.cmd = cmd
        this.cluster = cluster
    }

    apply = (resource: string) =>
        this.cmd.execWithStdIn(this.mkCmd('apply -f -'), resource)

    private mkCmd = (args: string) =>
        `kubectl ${args} --cluster=${this.cluster}`
}

export default Kubectl
