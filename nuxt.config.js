const nuxtPageCache = require('nuxt-page-cache')
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
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: '/js/jsencrypt.min.js',
        async: true
      },
      {
        src: '/js/qiniu.min.js',
        async: true
      },
      {
        src: '/js/plupload.full.min.js',
        async: true
      },
      {
        src: '/js/exif.js',
        async: true
      }
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
    '~/assets/css/main.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/bus',
    '~/plugins/axios',
    '~/plugins/utilHelper',
    '~/plugins/toast',

    '~/api/albumService',
    '~/api/commonService',
    '~/api/mediaService',
    '~/api/paixinService',
    '~/api/statisticsService',
    '~/api/tagService',
    // '~/api/uptokenService',
    '~/api/userService',

    '~/plugins/cookie',
    '~/plugins/scroll',
    '~/plugins/ecroll'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'cookie-universal-nuxt',
    ['cookie-universal-nuxt', { alias: 'cookiz' }]
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/api2': {
      target: 'https://api.paixin.com',
      pathRewrite: {
        '^/api2': '/'
      }
    },
    '/api': {
      target: 'https://api.7mx.com',
      pathRewrite: {
        '^/api': '/'
      }
    }
  },

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
    // middleware: 'axiosMiddle'
  },
  serverMiddleware: [
    nuxtPageCache.cacheSeconds(1, req => {
      if (req.query && req.query.pageType) {
        return req.query.pageType
      }
      return false
    })
  ]
}
