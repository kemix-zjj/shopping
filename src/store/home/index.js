// home模块的小仓库
import {
    reqCategoryList,
    reqGetBannerList,
    reqFloorList
} from "@/api";

// home模块仓库
const state = {
    // state中的数据默认初始值别瞎写 -- 根据接口的返回值初始化
    // 即服务器返回对象，起始值就是对象；服务器返回数组，起始值就是数组
    categoryList: [],
    // 轮播图的数据
    bannerList: [],
    // floor数据
    floorList: []
};

// mutations是唯一修改state的地方
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList;
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList;
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList;
    }
};

// actions 用户处理派发action的地方的，可以书写异步语句，自己逻辑的地方
const actions = {
    // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
    async categoryList({
        commit
    }) {
        let result = await reqCategoryList();
        if (result.code == 200) {
            commit("CATEGORYLIST", result.data)
            // 多了一条数据。在三级联动中。
            state.categoryList.length = 16
        }
    },
    // 获取首页轮播图的数据 -- mock虚拟数据
    // axios返回的是promise，因此需要等待其响应的结果，即要有await。同时await与async是cp
    async getBannerList({
        commit
    }) {
        let result = await reqGetBannerList();
        if (result.code == 200) {
            commit('GETBANNERLIST', result.data)
        }
    },
    // 获取floor数据
    async getFloorList({
        commit
    }) {
        let result = await reqFloorList();
        if (result.code == 200) {
            // 提交mutation
            commit('GETFLOORLIST', result.data)
        }
    }
};


// 计算属性
const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}