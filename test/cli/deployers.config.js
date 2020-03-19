module.exports = {
    envs: {
        foo: {
            type: 'vps',
            target: 'foo.com',
            dir: 'foo-dir'
        },
        bar: {
            type: 'vps',
            target: 'bar.com',
            dir: 'bar-dir',
            copyFromRepo: 'copy-from-repo-image',
            ssh: {
                user: 'bar-user',
                port: 123
            },
            versionProvider: {
                type: 'url',
                value: 'https://version.bar'
            }
        },
        koo: {
            type: 'k8s',
            target: 'koo-cluster',
            dir: 'koo-dir'
        }
    },
    versionProviders: {
        foo: {
            type: 'function',
            value: () => 'foo-123'
        }
    }
}
