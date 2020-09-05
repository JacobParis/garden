module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: '3',
          targets: 'last 2 versions',
        },
      ],
      ['@babel/preset-react'],
    ],
    plugins: [
      ['./babel-import-directory', {
        exts: ['.mdx']
      }],
      '@babel/plugin-proposal-optional-chaining',
      api.env('development') && 'react-refresh/babel',
    ].filter(Boolean),
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 10,
              },
            },
          ],
          '@babel/preset-react',
        ],
      },
    },
  }
}
