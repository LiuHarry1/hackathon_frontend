<template>
  <div id="app">
    <router-view />
    <Loading :loading="loading" />
  </div>
</template>

<script>
import Loading from './components/common/Loading';
export default {
  name: 'Root',
  components: { Loading },
  // 父子组件传参，子组件用inject接收参数。
  provide() {
    return {
      loadingStart: this.loadingStart,
      loadingEnd: this.loadingEnd,
    };
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    loadingStart() {
      this.loading = true;
    },
    loadingEnd() {
      this.loading = false;
    },
  },
  metaInfo: {
    title: 'Index',
    titleTemplate: '%s | Learning Management System',
    meta: [
      {
        name: 'keywords',
        content: 'Management System',
      },
      {
        name: 'description',
        content: ' Learning Management System',
      },
    ],
  },
};
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

::-webkit-scrollbar
  width 5px
  height 5px
  cursor pointer

::-webkit-scrollbar-thumb
  border-radius 5px
  -webkit-box-shadow inset 0 0 5px rgba(0, 0, 0, 0.2)
  background #e0e5eb

::-webkit-scrollbar-track
  box-shadow inset 0 0 5px rgba(0, 0, 0, 0.1)
  border-radius 0
</style>
