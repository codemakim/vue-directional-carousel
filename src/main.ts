import { createApp } from 'vue'
import App from './App.vue'
import DirectionalCarousel from './components/DirectionalCarousel.vue'

const app = createApp(App)
app.component('DirectionalCarousel', DirectionalCarousel)
app.mount('#app')
