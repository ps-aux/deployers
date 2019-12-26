import { createSshApi } from './SshRemoteApi'

/**
 * Manual test for purposes when password prompt is required.
 *
 * We do not plan to support password login in SSH during deployments anyways.
 */

const sshOpts = {
    host: 'localhost',
    port: 20022,
    user: 'ops'
}

const ssh = createSshApi({
    ssh: sshOpts,
    log: console.log
})

ssh.execRemoteCmd('eew', 'echo haha')
