import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createHead } from '@vueuse/head'

import '@/styles/main.css'
import '@/styles/prose.css'
import '@/styles/markdown.css'
import 'uno.css'
import '@unocss/reset/tailwind.css'

createApp(App).use(createHead()).use(router).mount('#app')
