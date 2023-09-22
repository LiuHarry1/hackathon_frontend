<template>
  <div class="article-comment-add" :class="noFace?'noFace':''">
    <template>
      <!-- <el-avatar v-if="!noFace" class="user-face" :size="50" :src="userInfo.userFace"></el-avatar> -->
      <div class="comment-add-box">
        <editor ref="editor" :lineNumbers="false" placeholder="Speak..." v-model="content"></editor>
        <!-- <el-input>ttt</el-input> -->
        <div style="width: 100%;text-align: right;margin-top: 10px;">
          <el-button size="mini" class="my-button-style-skin" @click="submit">Confirm</el-button>
          <el-button size="mini" class="my-button-style" @click="cancel">Cancel</el-button>
        </div>
      </div>
    </template>
    <!-- <template v-else>
      未登录
    </template> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import UserInfoShowCard from "./UserInfoShowCard";
  import Editor from "../../../components/forum/Editor";
  export default {
    name: "ArticleCommentAdd",
    components: {UserInfoShowCard,Editor},
    data() {
      return {
        content: null
      }
    },
    props:{
      noFace: Boolean
    },
    computed:{
      userInfo(){
        return this.$store.getters['User/getUserInfo'];
      },
    },
    methods: {
      //去指定用户的用户页面
      goUserPage() {
        this.$router.push({
          path: "/user/" + this.userInfo.userId
        })
      },

      submit(){
        this.$emit("submit",this.content);
        this.clearContent();
      },
      cancel(){
        this.$emit("cancel");
        this.clearContent();
      },
      clearContent(){
        this.content = "";
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.article-comment-add {
  /*display: flex;
  position: relative;
  flex-wrap: wrap;*/
  .user-face{
    position: absolute;
  }
  .comment-add-box{
    margin-left: 20px;
  }
  .Editor{
    border: 1px solid #DCDFE6;
    width: 100%;
    .CodeMirror{
      height: 100px;
    }
  }
}
.article-comment-add.noFace{
  .comment-add-box{
    margin-left: 0;
  }
}
</style>
