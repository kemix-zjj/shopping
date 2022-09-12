import {
    reqGoodsInfo,
    reqAddOrUpdateShopCart
} from "@/api"
// 封装游客身份模块uuid --> 生成一个随机的字符串（不能再变了）
import {
    getUUID
} from '@/utils/uuid_token'
const state = {
    goodInfo: {},
    // 游客的临时身份 --唯一的固定的 用本地存储进行存放。getUUID是一个函数。返回值是唯一的
    uuid_token: getUUID()
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo;
    }
}
const actions = {
    // 获取产品信息的action
    async getGoodInfo({
        commit
    }, skuId) {
        let result = await reqGoodsInfo(skuId)
        if (result.code == 200) {
            commit('GETGOODINFO', result.data)
        }
    },

    // 将产品添加到购物车中||修改某一个产品的个数
    async addOrUpdateShopCart({
        commit
    }, {
        // 要带两个参数
        skuId,
        skuNum
    }) {
        /**
         * 1.发请求：前端带一些参数给服务器，【需要存储这些数据】存储成功了，没有返回数据
         * 因此不需要再三连环（仓库存储数据）
         
         * 2.你需要注意的是，你点击按钮后，仓库是否成功发送请求。若成功干啥，若失败干啥
            注意：async函数返回执行的结果一定是一个promise【要么成功，要么失败】
         */
        let result = await reqAddOrUpdateShopCart(skuId, skuNum)
        // 代表服务器加入购物车成功
        if (result.code == 200) {
            return "ok"
        } else {
            // 代表加入购物车失败
            return Promise.reject(new Error('faile'))
        }
    }
}

// 简化数据而生
const getters = {
    // 路径导航简化的数据
    categoryView(state) {
        // 比如state.goodInfo初始状态为空对象，空对象的categoryView属性值是undefined
        // 当前计算出来的categoryView属性值至少是一个空对象，加的报错就不会有了
        return state.goodInfo.categoryView || {};
    },
    // 产品信息简化的数据
    skuInfo(state) {
        return state.goodInfo.skuInfo || {};
    },
    // 产品售卖属性的简化
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || [];
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}