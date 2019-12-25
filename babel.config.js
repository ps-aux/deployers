module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: true
                }
                // modules: false, // ES6 modules only
            }
        ],
        '@babel/typescript'
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        [
            'module-resolver',
            {
                extensions: ['.js', '.ts'],
                root: ['.']
            }
        ]
    ]
}
