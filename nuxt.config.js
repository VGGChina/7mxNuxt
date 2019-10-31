
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
      // {lang: 'zh'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/bus'
    // { src: '~/plugins/axios.js', ssr: true }
    // '~/plugins/axios'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  // modules: [
  //   '@nuxtjs/axios',
  //   '@nuxtjs/proxy'
  // ],

  // axios: {
  //   proxy: true
  //   // prefix: '/api', // baseURL
  //   // credentials: true
  // },
  // proxy: {
  //   '/api': {
  //     target: 'https://api.7mx.com/', // 代理地址
  //     // changeOrigin: true,
  //     pathRewrite: {
  //       '^/api': '' // 将 /api 替换掉
  //     }

  //   }
  // },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    // extend (config, ctx) {
    // }

    extend(config, { isDev, isClient }) {
      // if (isDev && isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  },

  router: {
    middleware: 'axiosMiddle'
  }

}
