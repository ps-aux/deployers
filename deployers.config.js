module.exports = {
    envs: {
        test: {
            type: 'vps',
            target: 'firmaren.garwan.io',
            dir: 'src/_test/deployment/DeploymentConfig/encrypted',
            ssh: {
                user: 'ops'
            },
            versionProvider: {
                type: 'url',
                value: 'https://api.moja.firmaren.garwan.io/'
            }
        }
    },
    versionProviders: {
        foo: {
            type: 'function',
            value: () => 'foo-123'
        }
    }
}
