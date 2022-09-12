<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- Footer 在Home、Search显示的，在登录，注册隐藏的 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from "./components/Header/Header.vue";
import Footer from "./components/Footer/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 通知Vuex发请求，获取数据，存储于仓库当中
    // 派发一个action||获取商品分类的三级列表数据 --
    this.$store.dispatch("categoryList");
  },
};
</script>

<style>
</style>
