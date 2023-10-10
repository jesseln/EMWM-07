// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    server: {
      fs: {
        strict: false
      }
    }
  },
  modules: [
    // '@nuxtjs/tailwindcss',
    'nuxt-lodash',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/supabase',
    'floating-vue/nuxt',
    'nuxt-icons',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt' // @vueuse/nuxt an add-on of VueUse, which provides better Nuxt integration auto-import capabilities.
  ],
  image: {
    presets: {
      bookImage: {
        modifiers: {
          width: 200,
          height: 200,
        }
      }
    }
  },
  googleFonts: {
    families: {
      // a name with spaces
      Roboto: true,
      'Source Sans 3': [100,150,200,250,300,350,400,450,500,550,600,650,700],
      'Source Serif 4': [100,150,200,250,300,350,400,450,500,550,600,650,700],
      Raleway: [100,150,200,250,300,350,400,450,500,550,600,650,700],
      // specific font weights
      // Lato: [100, 300],
    }
  },
  css: [
    // CSS file in the project
    '@/assets/css/main.css',
    // SCSS file in the project
    '@/assets/css/main.scss'
  ],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" 
        },
        {
            rel: 'stylesheet',
            href: 'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css' 
        },
        // {
        //   rel: 'stylesheet',
        //   href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@100;400&display=swap'
        // }
      ] 
    }
  },
  imports: {
    dirs: ['./stores'],
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  }
  // runtimeConfig: {
  //   // The private keys which are only available within server-side
  //     supabaseKey: process.env.SUPABASE_KEY,
  //   // Keys within public, will be also exposed to the client-side
  //   public: {
  //     supabaseUrl: process.env.SUPABASE_URL,
  //   }
  // }
})

