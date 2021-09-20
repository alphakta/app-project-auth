import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import {createRouter, createWebHistory} from 'vue-router'
import Login from './components/Login.vue'
import Profil from './components/Profil.vue'


const routes = [
    {name: 'login', path: '/',component: Login,},
    {name: 'profil', path: '/profil',component: Profil, props: true}

]

const router = createRouter({
    history: createWebHistory(),
    routes
})
const VueApp = createApp(App)

VueApp.use(router)
VueApp.mount('#app')

