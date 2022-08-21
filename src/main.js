import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid';

import dayjs from 'dayjs'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //axios请求拦截
axios.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //最后必须return config
    return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originVal) {

    return dayjs(originVal).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')