// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
  ],

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  colorMode: {
    preference: 'dark',
    classSuffix: '',
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  experimental: {
    typedPages: true,
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: true,
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

})
