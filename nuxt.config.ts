// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxtjs/mdc',
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

  mdc: {
    components: {
      prose: false,
      map: {
        h1: 'ProseH1',
        h2: 'ProseH2',
        h3: 'ProseH3',
        h4: 'ProseH4',
        li: 'ProseLi',
        ol: 'ProseOl',
        p: 'ProseP',
        ul: 'ProseUl',
        blockquote: 'ProseBlockquote',
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
      title: 'llm',
    },
  },

})
