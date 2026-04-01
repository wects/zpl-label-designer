// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    host: '127.0.0.1'
  },
  css: [
    '~/assets/css/main.css'
  ],
  vite: {
    plugins: [
      {
        name: 'strip-sourcemap-comment',
        enforce: 'pre',
        transform(code, id) {
          if (id.includes('zpl-renderer-js')) {
            return {
              code: code.replace(/\/\/# sourceMappingURL=.*/, ''),
              map: null
            }
          }
        }
      }
    ],
    optimizeDeps: {
      exclude: ['zpl-renderer-js']
    }
  }
})
// trigger dev rebuild
