module.exports = {
  purge: [
    './app/**/*.mdx',
    './app/**/*.js',
    './app/**/*.html',
  ],
  theme: {
    extend: {
      typography: {
        default: {
          css: {
            pre: {
              whiteSpace: 'pre-wrap'
            }
          }
        }
      },
      margin: {
        '-full': '-100%',
        full: '100%',
        '-cat': '-100%',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
