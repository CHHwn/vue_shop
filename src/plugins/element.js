import Vue from 'vue'
import Element, { Message } from 'element-ui'
import { MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'



Vue.use(Element)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm