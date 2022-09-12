// 当前这个模块:API进行统一管理
import {
    method
} from "lodash";
import requests from "./ajax";
import mockRequests from './mockAjax'

// 三级联动接口
//  /api/product/getBaseCategoryList  get  无参数
// 发请求：axios发送请求返回结果 Promise对象
export const reqCategoryList = () => requests({
    url: '/product/getBaseCategoryList',
    method: 'get'
})

// 获取banner(Home首页轮播图接口)
export const reqGetBannerList = () => mockRequests.get('/banner')

// 获取floor数据
export const reqFloorList = () => mockRequests.get('/floor')

// 获取搜索模块数据  地址：/api/list  请求方式：post  参数：需要带参数
// 当前这个函数需要接受外部传递参数！
// 当前这个接口（获取搜索模块的数据），给服务器传递一个默认参数【至少是一个空对象！！】
export const reqGetSearchInfo = (params) => requests({
    url: "/list",
    method: "post",
    data: params
})

// 获取产品详情信息的接口 URL：/api/item/{ skuId }  请求方式：GET
export const reqGoodsInfo = (skuId) => requests({
    url: `/item/${skuId}`,
    method: 'get'
})

// 将产品添加到购物车中、或者更新某一个产品的个数   
//      /api/cart/addToCart/{ skuId }/{ skuNum }  POST
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'post'
})

// 获取购物车列表数据的接口 URL：/api/cart/cartList 请求方式：GET
export const reqCartList = () => requests({
    url: '/cart/cartList',
    method: 'get'
})

// 删除购物车产品的接口 URL：/api/cart/deleteCart/{skuId} 请求方式：DELETE
export const reqDeleteCartById = (skuId) => requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'delete'
})

// 修改商品的选中状态 URL：/api/cart/checkCart/{skuId}/{isChecked}  请求方式：GET
export const reqUpdateCheckedById = (skuId, skuChecked) => requests({
    url: `/cart/checkCart/${skuId}/${skuChecked}`,
    method: 'get'
})

// 获取验证码 URL：/api/user/passport/sendCode/{phone}  请求方式：GET
export const reqGetCode = (phone) => requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get',
})

// 注册 URL：/api/user/passport/register  请求方式：POST  参数：phone，password，code 这里将三个参数封装到date对象中
// 注意：这边的url地址没有带参数，因此所需带的参数放进data里面
export const reqUserRegister = (data) => requests({
    url: `/user/passport/register`,
    data,
    method: 'post',
})

// 登录 URL：/api/user/passport/login 请求方式：POST 参数：phone password
// 注意：这边的url地址没有带参数，因此所需带的参数放进data里面 ：data这边是KV一致
export const reqUserLogin = (data) => requests({
    url: '/user/passport/login',
    data,
    method: 'post'
})

// 获取用户的信息【需要带着用户的token向服务器要用户信息】 --- 这边需要用到响应头挟带参数
// URL：/api/user/passport/auth/getUserInfo  请求方式：GET
export const reqUserInfo = () => requests({
    url: '/user/passport/auth/getUserInfo ',
    method: 'get'
})

// 退出登录  URL：/api/user/passport/logout  请求方式：GET
export const reqLogout = () => requests({
    url: '/user/passport/logout',
    method: 'get'
})

// 获取用户地址信息  URL：/api/user/userAddress/auth/findUserAddressList  请求方式：GET
export const reqAddressInfo = () => requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method: 'get'
})

// 获取商品清单  URL：/api/order/auth/trade 请求方式：GET
export const reqOrderInfo = () => requests({
    url: '/order/auth/trade',
    method: 'get'
})

// 提交订单  URL：/api/order/auth/submitOrder?tradeNo={tradeNo}  请求方式：POST 参数：tradeNo和6个参数（用data存储）
export const reqSubmitOrder = (tradeNo, data) => requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
    method: 'post'
})

// 支付信息 URL：/api/payment/weixin/createNative/{orderId}  请求方式：GET
export const reqPayInfo = (orderId) => requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'get'
})

// 获取支付订单状态  URL：/api/payment/weixin/queryPayStatus/{orderId}   请求方式：GET
export const reqPayStatus = (orderId) => requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'get'
})

// 获取个人中心的数据   URL：/api/order/auth/{page}/{limit}  请求方式：GET
export const reqMyOrderList = (page, limit) => requests({
    url: `/order/auth/${page}/${limit}`,
    method: 'get'
})