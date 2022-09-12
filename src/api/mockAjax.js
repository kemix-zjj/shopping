// 对于axios进行二次封装 === 目的：用到其的请求/响应拦截器
import axios from "axios"

// 引入进度条
import nprogress from "nprogress";
// 引入进度条样式
import "nprogress/nprogress.css"
// start:进度条开始   done:进度条结束

// 1.利用axios对象的方法create,去创建一个axios实例
// 2.request就是axios,只不过稍微配置了一下
const requests = axios.create({
    // 配置对象
    // 基础路径，发送请求的时候，路径当中会出现mock
    baseURL: "/mock",
    // 代表请求超时的时间 5s
    timeout: 5000,
})

// 请求拦截器：在发送请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    // 进度条开始动
    nprogress.start();
    // config:配置对象，对象里面有一个属性很重要：headers请求头
    return config;
})
// 响应拦截器：里面有成功的回调和失败的回调
requests.interceptors.response.use((res) => {
    // 服务器成功的回调，服务器响应的数据回来以后，响应拦截器可以检测到，可以做一些事情
    // 进度条结束
    nprogress.done();
    return res.data;
}, (error) => {
    // 服务器响应失败的回调 -- 例如终止promise
    return Promise.reject(new error('faile'))
})

// 对外暴露
export default requests;