module.exports = {
    envs: {
        test: {
            type: 'vps',
            target: 'firmaren.garwan.io',
            dir: 'src/_test/deployment/DeploymentConfig/encrypted',
            ssh: {
                user: 'ops'
            }
        }
    }
}
