import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)


const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/Login' },
        { path: '/login', component: Login },
        { path: '/Home', component: Home }
    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from从那个路径跳转而来
    // next是一个函数，表示放行
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})



export default router