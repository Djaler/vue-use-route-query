import '@picocss/pico/css/pico.min.css';

import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App.vue';
import Main from './views/Main.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Main },
    ],
});

createApp(App)
    .use(router)
    .mount('#app');
