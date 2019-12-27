import { createSshApi } from 'src/remote/SshRemoteApi'

/**
 * For now require the Docker container to run
 */
describe('manual integration tests', () => {
    const envPort = process.env.TEST_SSH_PORT || '20022'

    const sshOpts = {
        host: 'localhost',
        port: parseInt(envPort, 10),
        user: 'ops'
    }

    const ssh = createSshApi({
        ssh: sshOpts
    })

    it('cmd execution', () => {
        let res = ssh.execRemoteCmd('.', 'echo haha; pwd')

        expect(res).toBeNull()

        // In another srcDir
        ssh.ensureDir('foo')
        res = ssh.execRemoteCmd('foo', 'pwd', true)

        expect(res).toBe('/home/ops/foo')
    })

    it('copy file to nonexisting srcDir', () => {
        ssh.ensureDir('foo')
        ssh.copyTextFile('foo', 'a/b/file.txt', 'this is file content', {
            createIntermediateDirs: true
        })

        const res = ssh.execRemoteCmd('foo', 'find', true)

        expect(res).toBe('.\n' + './a\n' + './a/b\n' + './a/b/file.txt')
        ssh.execRemoteCmd('foo', 'rm -rf *')
    })
})
