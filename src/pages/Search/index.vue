<template>
  <div>
    <!-- 商品分类三级列表 -->
    <typeNav />
    <div class="main">
      <div class="py-container">
        <!--bread：面板屑，带有x的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">×</i>
            </li>
            <!-- 品牌的售卖的属性值的面包屑 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector：属于Search路由的子组件-->
        <!-- 给父亲绑定自定义事件trademarkInfo,attrInfo 从而实现子给父传递数据 -->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <!-- 价格结构 -->
          <div class="sui-navbar">
            <!-- 排序结构 -->
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changOrder('1')">
                  <a
                    >综合
                    <span
                      v-show="isOne"
                      class="iconfont"
                      :class="{
                        'icon-long-arrow-down': isDesc,
                        'icon-long-arrow-up': isAsc,
                      }"
                    ></span>
                  </a>
                </li>
                <li :class="{ active: isTwo }" @click="changOrder('2')">
                  <a
                    >价格
                    <span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{
                        'icon-long-arrow-down': isDesc,
                        'icon-long-arrow-up': isAsc,
                      }"
                    ></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售的产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 因为属性值中出现了变量，所以我们采用了:to 动态绑定-->
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 :动态拉取服务器中的数据-->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
// import { mapState } from "vuex";
import { mapGetters, mapState } from "vuex";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Search",

  components: {
    SearchSelector,
  },

  data() {
    return {
      // 带给服务器的参数 咱们先写10个占个位。至少是10个
      searchParams: {
        // 一级分类的id
        category1Id: "",
        // 二级分类的id
        category2Id: "",
        // 三级分类的id
        category3Id: "",
        // 分类的名字
        categoryName: "",
        // 关键字
        keyword: "",
        // 排序：初始状态应该是综合|降序
        order: "1:desc",
        // 分页器用的：代表是当前是第几页
        pageNo: 1,
        // 代表是每一页展示数据的个数
        pageSize: 3,
        // 平台售卖属性操作所带的参数
        props: [],
        // 品牌
        trademark: "",
      },
    };
  },

  beforeCreate() {},
  created() {},
  // 当组件挂载完毕之前会执行一次【先于mounted之前】
  beforeMount() {
    // 复杂的写法
    // this.searchParams.category1Id = this.$route.query.category1Id;
    // this.searchParams.category2Id = this.$route.query.category2Id;
    // this.searchParams.category3Id = this.$route.query.category3Id;
    // this.searchParams.categoryName = this.$route.query.categoryName;
    // this.searchParams.keyword = this.$route.params.keyword;

    // 简单写法 Object.assign()  ===合并对象
    // 在发送请求之前，把接口需要传递的参数进行整理（在服务器发请求之前，把参数整理好，服务器就会返回查询的数据）
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  // 组件挂载完毕执行一次，【且只执行一次】
  // 发送请求获取服务器的数据不能只是一次，因此需要将请求函数放在method中
  mounted() {
    // 在发请求之前带给服务器参数 【searchParams参数发生变化，即有数值带给服务器】
    this.getData();
  },

  // 捞数据 ---> 可以这么写，但是麻烦。此时采取getter计算属性进行简化
  // 即在仓库中就已经简化所要获取数据的路径
  computed: {
    //   ...mapState({
    //     goodList: (state) => state.search.searchList.goodList,
    //   }),

    // mapGetters里面的写法：传递的数组，因为getters计算是没有划分模块的【home,search】
    ...mapGetters(["goodsList"]),

    // 综合和价格看选中哪个，是否需要变红 --- 布尔值
    // 是不是综合：1
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    // 是不是价格：2
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    // 是不是降序
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    // 是不是升序
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },

    // 获取search模块展示的产品一共多少数据
    ...mapState({
      total: (state) => state.search.searchList.total,
    }),
  },

  // 函数声明一次，可以多次调用
  methods: {
    // 向服务器发送请求获取search模块数据（根据参数不同返回不同数据进行展示)
    // 把这次请求封装成一个函数，当你需要调用的时候再调用即可
    getData() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },

    // 删除分类的名字
    removeCategoryName() {
      // 只是把带给服务器的参数置空了，还需要向服务器发请求
      // 空字符串会传给服务器，但是undefined是不会传给服务器。
      // 带给服务器的参数说明都是可有可无的，如果属性值为空的字符串还是会把相应的字段带给服务器
      // 但是你把相应的字段变成undefined，当前这个字段是不会带给服务器的
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      // 地址栏也需要改变：骚操作===》进行路由的跳转 自己跳自己
      // 严谨：本意是删除query，如果路径中带有params则不应该删除params，路由跳转的时候应该带着
      if (this.$$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },

    // 删除关键字
    removeKeyword() {
      // 给服务器带的参数searchParams的keyword置空 == 这里是对search组件中的params参数进行置空
      this.searchParams.keyword = undefined;
      // 再次发请求
      this.getData();
      // 通知兄弟组件Header清除关键字 -- 即在搜索框中的关键字也需要进行置空
      this.$bus.$emit("clear");
      // 进行路由的跳转
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },

    // 自定义事件的回调  品牌
    trademarkInfo(trademark) {
      // 1.整理品牌字段参数  “ID：品牌名称”
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // 2.再次发请求,获取search模块列表数据进行展示
      this.getData();
    },

    // 删除品牌的信息
    removeTrademark() {
      // 将品牌信息置空
      this.searchParams.trademark = undefined;
      // 再次发请求
      this.getData();
    },

    // 收集平台属性的回调函数（自定义事件）
    attrInfo(attr, attrValue) {
      // ["属性ID：属性值：属性名"]
      // 参数格式整理好
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 数组去重！！！为防止重复点击一个属性而出现多次
      if (this.searchParams.props.indexOf(props) == -1) {
        // 将所得到的数组push到props属性中
        this.searchParams.props.push(props);
        // 再次发请求
        this.getData();
      }
    },

    // removeAttr删除售卖属性
    removeAttr(index) {
      // 再次整理参数  （参数索引值，删除几个）
      this.searchParams.props.splice(index, 1);
      // 再次发请求
      this.getData();
    },

    // 排序操作
    changOrder(flag) {
      // flag形参：它是一个标记，代表用户点击的是综合（1）还是价格（2）【用户点击的时候传递过来的】
      // 现在需要获取order初始状态【咱们需要通过初始状态去判断接下来做什么】
      // 初始状态是1:desc
      let originOrder = this.searchParams.order;
      // 初始选择 综合还是价格 取数字1 or 2  .split(":")[0]代表用：分割，取第一个值
      let originFlag = this.searchParams.order.split(":")[0];
      // 初始排序 升序还是降序
      let originSort = this.searchParams.order.split(":")[1];

      // 准备一个新的order属性值
      let newOrder = "";
      // 这个已经我能确定点击的一定是综合
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSort == "desc" ? "asc" : "desc"}`;
      } else {
        // 点击的是价格
        newOrder = `${flag}:${"desc"}`;
      }

      // 将新的order赋予searchParams
      this.searchParams.order = newOrder;
      // 再次发请求
      this.getData();
    },

    // 自定义事件的回调函数 --- 获取当前第几页
    getPageNo(pageNo) {
      // 整理带给服务器的参数
      this.searchParams.pageNo = pageNo;
      // 再次发请求
      this.getData();
    },
  },

  // 发现组件身上的$route属性，会跟着我们的点击事件的请求从而发生url地址参数的变化。
  // 数据监听：监听组件实例身上的属性的属性值变化
  watch: {
    // 监听路由的信息是否发生变化，如果发生变化，再次发生请求
    $route(newValue, oldValue) {
      // 再次发请求之前整理带给服务器的参数
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      // 再次发起ajax请求
      this.getData();
      // 每一次请求完毕，应该把相应的1/2/3级分类的id置空的，让它接收下一次相应的1/2/3id
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>