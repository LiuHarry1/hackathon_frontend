<template>
  <div class="container">
    <user-register class="login" />
  </div>
</template>

<script>
import UserRegister from '@/components/common/UserRegister.vue';
export default {
  name: 'Register',
  components: { UserRegister },
  metaInfo: {
    title: 'Register',
  },
};
</script>

<style scoped lang="stylus">
.container
  height 100vh
  background #f0f2f5 url('~@/assets/bg.svg') repeat
  .login
    center()
</style>
