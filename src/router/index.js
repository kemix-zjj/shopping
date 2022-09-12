// 配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
// 引入store 为获取到token
import store from '@/store'

// 使用插件
Vue.use(VueRouter)


// 先把VueRouter原型对象的push|replace保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

// 重写push|replace
// 第一个参数：告诉原来的push|replace方法，你往哪跳转（传递哪些参数）
// 第二个参数：成功回调
// 第三个参数：失败回调
// call和apply的区别：
// 同：都可以调用函数一次，都可以篡改函数的上下文一次(上下文即this)
// 不同：call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组
VueRouter.prototype.push = function (location, resolve, rejecet) {
    if (resolve && rejecet) {
        // 这里的this指向的是vuerouter
        originPush.call(this, location, resolve, rejecet);
    } else {
        originPush.call(this, location, () => {}, () => {});
    }
}
VueRouter.prototype.replace = function (location, resolve, rejecet) {
    if (resolve && rejecet) {
        // 这里的this指向的是vuerouter
        originReplace.call(this, location, resolve, rejecet);
    } else {
        originReplace.call(this, location, () => {}, () => {});
    }
}


// 配置路由
let router = new VueRouter({
    // 解决本地运行好好，但是部署到服务器出现404问题
    mode: 'history',
    // 配置路由
    routes,
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置  y=0 代表的滚动条在最上方
        return {
            y: 0
        }
    }
})

// 全局守卫 -- 前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to, from, next) => {
    // to:可以获取到你要跳转到哪个路由信息
    // from：可以获取到你从哪个路由而来的信息
    /**
     * next: 放行函数！！
     * 1.next() 直接放行
     * 2.next(path) 放行到指定的路由
     * 3.next(false) 中断当前的导航 */

    //用户登录了，才会有token，未登录一定不会有token
    let token = store.state.user.token;
    // 用户信息 -- 不能那userInfo去判断，因为刷新后是为空对象。空对象一直为真。
    // 因此通过空对象中是否具有属性name
    let name = store.state.user.userInfo.name;

    // 用户已经登录了
    if (token) {
        // 用户已经登录了还想去login[不能去，停留在首页]
        if (to.path == '/login' || to.path == '/register') {
            next('/');
        } else {
            // 登录了，但是去的不是login,register【home|search|detail】
            // 如果用户名已有
            if (name) {
                // 登录了且拥有用户信息，放行
                next();
            } else {
                // 没有用户信息，则要去派发action让仓库获取用户信息再跳转
                try {
                    //在路由跳转之前，获取用户信息成功，放行
                    await store.dispatch("getUserInfo");
                    next();
                } catch (error) {
                    // token实效了，获取不到用户的信息，重新登录
                    // 清除token
                    await store.dispatch('userLogout')
                    next('/login');
                }
            }
        }
    } else {
        // 未登录 不能去交易相关trade、不能去支付相关pay,paysuccess、不能去个人中心
        // 未登录的话如果要去上面这些路由 --- 直接跳转到登录页
        let toPath = to.path;
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            // 把未登录的时候向去而没有去成的信息，存储与地址栏中【路由】
            next('/login?redirect=' + toPath)
        } else {
            // 未登录的话，如果去的不是上面这些路由(home|search|shopcart) --- 放行
            next();
        }




    }

})

// 对外暴露
export default router;