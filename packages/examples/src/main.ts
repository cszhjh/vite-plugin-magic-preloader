import './assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'

import router from '@/router/index'

import '@varlet/touch-emulator'

createApp(App).use(router).mount('#app')
