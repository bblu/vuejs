import Login from './views/pages/login.vue'
import Home from './views/pages/home.vue'
import Register from './views/pages/register.vue'

let routes = [
    {
        path: '/login',
        component: Login
    },

    {
        path: '/register',
        component: Register
    },
    
    {
        path: '/',
        component: Home
    },

    {
        path: '*',
        redirect: { path: '/' }
    }
];

export default routes;