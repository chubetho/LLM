// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
  ],

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  colorMode: {
    preference: 'dark',
    classSuffix: '',
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  experimental: {
    typedPages: true,
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  tailwindcss: {
    viewer: false,
    editorSupport: true,
    quiet: true,
    cssPath: './assets/tailwind.css',
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  app: {
    head: {
      title: 'Queezee',
    },
  },

})
