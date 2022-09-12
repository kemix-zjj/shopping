import {
    reqGetSearchInfo
} from "@/api";
// search模块的小仓库
const state = {
    // 仓库初始状态
    searchList: {}
};
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
};
const actions = {
    // 获取search模块数据
    async getSearchList({
        commit
    }, params = {}) {
        //    当前这个reqGetSearchInfo这个函数在调用获取服务器数据的时候，至少传递一个参数（空对象）
        // params形参，是当派发action的时候，第二个参数传递过来的，至少是一个空对象
        let result = await reqGetSearchInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHLIST', result.data)
        }

    }
};

// 计算属性，在项目中是为了简化数据而生
// getters可以把我们将来在组件当中需要用到的数据简化一下【将来组件在获取数据的时候就方便了】
const getters = {
    // 当前形参state，是当前仓库中的state，病房大仓库的那个state
    goodsList(state) {
        // 这样书写是有问题的.因为searchList有两个值，
        // 数据还没传过来的时的空对象{空对象没有goodsList属性==undefined报错}，数据已经传过来的对象

        // state.searchList.goodsList 如果服务器数据回来了，没问题是一个数组
        // 假如网络不给力/根本没有网络 state.searchList.goodsList应该返回的是undefined，但是如果没有空数组的话，空对象.属性 -- undefined报错
        // 计算新的属性的属性值至少给你人家一个数组 以防万一
        return state.searchList.goodsList || [];
    },
    trademarkList(state) {
        return state.searchList.trademarkList;
    },
    attrsList(state) {
        return state.searchList.attrsList;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}