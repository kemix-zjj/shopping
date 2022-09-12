// 路由配置信息
// 引入路由组件
// import Home from '@/pages/Home'
// import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
// 引入二级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'


/**
 * 当打包构建应用时，JavaScript包会变得非常大，影响页面加载
 * 如果我们能把不同路由对应的组件分割成不同的代码块，
 * 然后当路由被访问的时候才加载对应组件，这样就更加高效了。
 */

export default [{
        path: '/center',
        component: Center,
        meta: {
            show: true
        },
        // 二级路由组件
        children: [{
            path: 'myorder',
            component: MyOrder,
        }, {
            path: 'grouporder',
            component: GroupOrder
        }, {
            // 重定向，刚刚开始默认显示啥
            path: '/center',
            redirect: '/center/myorder'
        }]
    }, {
        path: '/paysuccess',
        component: PaySuccess,
        meta: {
            show: true
        }
    }, {
        path: '/pay',
        component: Pay,
        meta: {
            show: true
        },
        beforeEnter: (to, from, next) => {
            if (from.path == '/trade') {
                next();
            } else {
                next(false);
            }
        }
    }, {
        path: '/trade',
        component: Trade,
        meta: {
            show: true
        },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // 去交易页面，必须从购物车而来
            if (from.path == '/shopcart') {
                next();
            } else {
                // 其他路由的话，停留在当前
                next(false);
            }
        }
    }, {
        path: '/shopcart',
        component: ShopCart,
        meta: {
            show: true
        }
    }, {
        path: '/addcartsuccess',
        name: 'addcartsuccess',
        component: AddCartSuccess,
        meta: {
            show: true
        }
    }, {
        path: '/detail/:skuid',
        component: Detail,
        meta: {
            show: true
        }
    }, {
        path: '/home',
        component: () => import('@/pages/Home'),
        meta: {
            show: true
        }
    },
    {
        // 占位后面加上一个问号，代表params参数可传可不传。
        path: '/search/:keyword?',
        component: () => import('@/pages/Search'),
        meta: {
            show: true
        },
        name: "search",
        // 路由组件能不能传递props数据？ 3种
        // 第一种：布尔值的写法 仅仅使用用params参数  --- 把params参数作为路由组件上的一个属性
        // props: true,
        // 第二种：对象写法 额外的给路由组件传递一些props
        // props: { a: 1, b: 2}
        // 第三种：函数写法：可以给params参数、query参数，通过props传递给路由组件 ---- 最常用
        props: ($route) => ({
            keyword: $route.params.keyword,
            k: $route.query.k
        })
    },


    {
        path: '/login',
        component: Login,
        meta: {
            show: false
        }
    },
    {
        path: '/register',
        component: Register,
        meta: {
            show: false
        }
    },

    // 重定向，在项目跑起来的时候，访问/，立马让它定向到首页
    {
        path: '*',
        redirect: '/home'
    }
]