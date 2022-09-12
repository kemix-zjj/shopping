import Vue from 'vue'
import App from './App.vue'

// 引入路由
import router from '@/router'

// 引入仓库
import store from './store'

// 三级联动组件 --- 注册为全局组件
import TypeNav from '@/components/TypeNav'
// 第一个参数：全局组件的名字   第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)

// 轮播图 --- 注册为全局组件
import Carousel from "@/components/Carousel";
Vue.component(Carousel.name, Carousel)

// 分页器 --- 注册为全局组件 - 实现共享
import Pagination from '@/components/Pagination'
Vue.component(Pagination.name, Pagination)

// 引入MockServer.js --- mock数据
import '@/mock/mockServe'

// 引入swiper样式
import "swiper/css/swiper.css"

Vue.config.productionTip = false

// 统一接收api文件夹中全部的请求函数
// 统一引入：这里的API是一个对象，其中包括所有的请求接口函数
import * as API from '@/api'

// element-ui的使用 
import {
  Button,
  MessageBox
} from 'element-ui';
//第一种：注册为全局组件 --  Button 
Vue.component(Button.name, Button)
// 第二种：挂载在原型上 -- MessageBox
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 引入需要进行懒加载的图片
import atm from '@/assets/1.gif'
// 引入懒加载图片
import VueLazyload from 'vue-lazyload'
// 注册懒加载插件
Vue.use(VueLazyload, {
  // 懒加载默认图片
  loading: atm
});

// 引入自定义插件
import myPlugins from './plugins/myPlugins'
Vue.use(myPlugins, {
  name: 'upper'
});

// 引入表单校验插件
import '@/plugins/validate';


new Vue({
  render: h => h(App),
  // 全局事件总线$bus的配置,这边的this即为VM
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },

  // 注册路由:下面的写法是KV一致的省略V【router小写的】
  // 注册路由信息：当这里书写router的时候，组件身上都拥有$route,$router属性
  router,
  // 注册仓库:组件实例身上会多了一个属性$store属性
  store
}).$mount('#app')