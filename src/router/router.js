import Vue from 'vue'
import VueRouter from 'vue-router'
/* import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue' */




Vue.use(VueRouter)


const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/Login' },
        { path: '/login', component: () =>
                import ('../components/Login.vue') },
        {
            path: '/Home',
            component: () =>
                import ('../components/Home.vue'),
            redirect: '/Welcome',
            children: [
                { path: '/Welcome', component: () =>
                        import ('../components/Welcome.vue') },
                { path: '/users', component: () =>
                        import ('../components/user/User.vue') },
                { path: '/rights', component: () =>
                        import ('../components/power/Rights.vue') },
                { path: '/roles', component: () =>
                        import ('../components/power/Roles.vue') },
                { path: '/categories', component: () =>
                        import ('../components/goods/Cate.vue') },
                { path: '/params', component: () =>
                        import ('../components/goods/Params.vue') },
                { path: '/goods', component: () =>
                        import ('../components/goods/List.vue') },
                { path: '/goods/add', component: () =>
                        import ('../components/goods/Add.vue') },
                { path: '/orders', component: () =>
                        import ('../components/order/Order.vue') },
                { path: '/reports', component: () =>
                        import ('../components/report/Report.vue') },
            ]
        }
    ]
})

//????????????????????????
router.beforeEach((to, from, next) => {
    // to?????????????????????
    // from???????????????????????????
    // next??????????????????????????????
    if (to.path === '/login') return next();
    //??????token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})



export default router