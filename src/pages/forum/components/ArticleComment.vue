<template>
  <div class="article-comment" :class="easy?'easy':''" >
    <template v-if="!easy">
      <!-- <user-info-show-card :userDTO="comment.userDTO">
        <el-avatar :size="50" :src="comment.userDTO.userFace"></el-avatar>
      </user-info-show-card> -->
      <!-- <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar> -->
    </template>
    <div class="comment-box">
      <template v-if="!easy">
        <div class="comment" :id="'comment-' + comment.articleCommentId">
          <!-- <editor :class="startEdit?'startEdit':''" ref="editor" :line-numbers="false" :show-tools="startEdit ? true : false" :active="startEdit? false : true" v-model="comment.articleComment"></editor> -->
          {{comment.articleComment}}
        </div>
        <div class="info-box">
          <!-- <el-link class="nick my-el-link" style="vertical-align: unset;" @click="goUserPage">{{comment.userDTO.userNick}}</el-link> -->
          <span class="time">
          {{$utils.quickTimeago(comment.articleCommentTime)}}
        </span>
        </div>
      </template>
      <template v-else>
        <div class="info-box" :id="'comment-' + comment.articleCommentId">
          <!-- <el-link class="nick my-el-link" style="vertical-align: unset;" @click="goUserPage">{{comment.userDTO.userNick}}</el-link> -->
          <template v-if="level > 2">
            <span> Reply </span>
            <!-- <el-link @mouseenter="onMouseEnterReply" @mouseleave="onMouseLeaveReply" class="nick my-el-link" style="vertical-align: unset;" @click="goUserPage(parentComment)">{{parentComment.userDTO.userNick}}</el-link> -->
          </template>
          <span>：</span>
          <!-- <editor :class="startEdit?'startEdit':''" ref="editor" :line-numbers="false" :show-tools="startEdit?true:false" :active="startEdit? false : true" v-model="comment.articleComment"></editor> -->
        </div>
      </template>

      <div v-if="!startEdit" class="operate" style="text-align: right;">
        <span @click="startReplay = !startReplay">Reply</span>
        <!-- <template v-if="isMy">
          <span @click="startEdit = true">Edit</span>
          <span @click="onDel(comment)">Delete</span>
        </template> -->
      </div>
      <template v-if="startEdit">
        <div style="width: 100%;text-align: right;margin-top: 10px;">
          <el-button size="mini" class="my-button-style-skin" @click="onEdit(comment)">确认</el-button>
          <el-button size="mini" class="my-button-style" @click="startEdit = false">Cancel</el-button>
        </div>
      </template>
      <template v-if="startReplay">
        <article-comment-add noFace @submit="onReplay({content: $event,commentId: comment.articleCommentId})" @cancel="startReplay = false"></article-comment-add>
      </template>
      <!-- 多层评论 -->
      <template v-if="comment.sonArticleComments && comment.sonArticleComments.length > 0">
        <el-divider class="mini"></el-divider>
        <div class="son-article-comments" v-for="(sonComment,index) in comment.sonArticleComments" :key="sonComment.articleCommentId">
          <article-comment easy :level="level + 1" @replay="onReplay" @edit="onEdit" @del="onDel" :comment="sonComment"></article-comment>
          <el-divider class="mini" v-if="index < comment.sonArticleComments.length - 1"></el-divider>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import UserInfoShowCard from "./UserInfoShowCard";
  // import Editor from "../../../components/forum/Editor";
  import ArticleCommentAdd from "./ArticleCommentAdd";
  export default {
    name: "ArticleComment",
    components: {ArticleCommentAdd, UserInfoShowCard},
    data() {
      return {
        startReplay: false,
        startEdit: false,
        parentComment: {
          userDTO: {
            userNick: null
          }
        }
      }
    },
    props:{
      comment: Object,
      easy: Boolean,
      level: {
        type: Number,
        default: 1
      }
    },
    computed:{
      isMy(){
        if (!this.comment || !this.$store.getters['User/getUserInfo']) return false;
        return this.comment.userDTO.userId === this.$store.getters['User/getUserInfo'].userId;
      },
    },
    mounted(){
      if (this.level > 1){
        this.parentComment = this.$parent.comment;
      }
    },
    methods: {
      //去指定用户的用户页面
      goUserPage(comment=null) {
        if (comment == null){
          comment = this.comment;
        }
        this.$router.push({
          path: "/user/" + comment.userDTO.userId
        })
      },

      /**
       * 回复事件
       */
      onReplay({content: content,commentId: commentId}){
        this.startReplay = false;
        this.$emit("replay",{
          content: content,
          commentId: commentId
        });
      },
      /**
       * Edit事件
       */
      onEdit(comment){
        this.startEdit = false;
        this.$emit("edit",comment);
      },
      /**
       * Delete事件
       */
      onDel(comment){
        this.$emit("del",comment);
      },



      onMouseEnterReply(){
        if (this.level > 2){
          //TODO 抖动功能
        }
      },
      onMouseLeaveReply(){
        if (this.level > 2){

        }
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.article-comment {
  /*display: flex;
  position: relative;
  flex-wrap: wrap;*/
  .user-info-show-card{
    position: absolute;
  }
  .comment-box{
    margin-left: 20px ;
    flex: 1;
    .info-box{
      .nick{
        font-size: 16px;
        font-weight: bold;
      }
      .time{
        /*float: right;*/
        font-size: 12px;
        color: var(--gray);
      }
    }
  }
  .comment{
    margin-top: 5px;
    word-break: break-word;
    .markdown-body{
      min-height: auto;
      padding: 0;
    }
  }
  .operate{
    text-align: right;
    > span{
      margin-left: 10px;
      color: var(--gray);
      font-size: 10px;
      cursor: pointer;
    }
  }
  .Editor.startEdit{
    border: 1px solid #DCDFE6;
    width: 100%;
    .CodeMirror{
      height: 100px;
    }
  }

  .el-divider.mini{
    margin: 10px 0;
  }
}
.article-comment.easy{
  .comment-box {
    margin-left: 0;
    .info-box .nick {
      font-size: 13px;
      font-weight: unset;
    }
    .Editor{
      display: inline-block;
      .CodeMirror{
        height: auto;
      }
      .markdown-body{
        padding: 0;
      }
    }

  }
}
</style>
