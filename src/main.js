import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-vue/dist/bootstrap-vue.css'  
import './assets/main.css';  
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router).mount('#app')
