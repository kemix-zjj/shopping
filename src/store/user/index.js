// 登录注册的数据全部放在这个仓库中
import {
    reqGetCode,
    reqUserRegister,
    reqUserLogin,
    reqUserInfo,
    reqLogout
} from "@/api";
// 引入本地存储持久化数据
import {
    setToken,
    getToken,
    removeToken
} from "@/utils/token";
const state = {
    code: '',
    token: getToken(),
    userInfo: {},
};
const mutations = {
    GETCODE(state, code) {
        state.code = code;
    },
    USERLOGIN(state, token) {
        state.token = token;
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    // 清除本地数据
    CLEAR(state) {
        // 把仓库中相关用户信息清空
        state.token = '';
        state.userInfo = '';
        // 本地存储数据清空
        removeToken();
    }
};
const actions = {
    // 获取验证码
    async getCode({
        commit
    }, phone) {
        // 获取验证码的这个接口，是把验证码返回，但是正常情况，后台是把验证码发到用户的手机上【省钱】
        let result = await reqGetCode(phone);
        if (result.code == 200) {
            commit('GETCODE', result.data);
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 用户注册
    async userRegister({
        commit
    }, user) {
        // 注册可能成功，也可能失败，所以用await等待结果
        let result = await reqUserRegister(user);
        if (result.code == 200) {
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 登录业务【token - 令牌】
    async userLogin({
        commit
    }, data) {
        let result = await reqUserLogin(data);
        // 服务器下发token,用户唯一标识符（类似uuid)
        // 将来经常通过token找服务器要用户信息进行展示
        if (result.code == 200) {
            // 用户已经登录成功且获取到token
            commit("USERLOGIN", result.data.token);
            // 持久化存储token
            // localStorage.setItem("TOKEN", result.data.token) --> 封装到另外的文件夹
            setToken(result.data.token);
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }

    },
    // 获取用户信息
    async getUserInfo({
        commit
    }) {
        let result = await reqUserInfo();
        if (result.code == 200) {
            //提交用户信息
            commit("GETUSERINFO", result.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 退出登录
    async userLogout({
        commit
    }) {
        // 通知向服务器发起一次请求，通知服务器清除token
        let result = await reqLogout();
        if (result.code == 200) {
            // action不能操作state，因此需要提交给mutations来操作state
            commit('CLEAR');
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }

};
const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}