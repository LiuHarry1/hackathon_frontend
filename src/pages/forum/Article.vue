<template>
  <div class="article">
    <home-layout>
      <template slot="left">
        <el-card class="box-card article-card" :class="{'delete-status': article.articleStatus === 0 }">
          <div slot="header" class="article-card-header">
            <!-- <user-info-show-card :userDTO="article.userDTO">
              <el-avatar :size="50" :src="article.userDTO.userFace"></el-avatar>
            </user-info-show-card> -->
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <div class="article-box">
              <div class="title">{{article.articleTitle}}</div>
              <div class="info">
                  <span>
                    {{ article.userName }}
                    <span> · </span>
                    <!-- <el-link class="author-name my-el-link" style="vertical-align: unset;" @click="goUserPage">{{article.userDTO.userNick}}</el-link> -->
                    <!-- <span> · </span> -->
                    <span :title="article.articleAddTime">{{$utils.quickTimeago(article.articleAddTime)}}</span>
                  </span>
              </div>
          </div>
          <!-- <div v-if="isMy">
            <el-dropdown @command="handleCommand">
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown" style="width: 150px;">
                <el-dropdown-item icon="el-icon-edit-outline" command="goEditArticle">Edit</el-dropdown-item>
                <el-dropdown-item v-if="article.articleStatus === 1" divided icon="el-icon-delete" command="delArticle">Delete</el-dropdown-item>
                <el-dropdown-item v-else divided icon="el-icon-delete" command="restoreArticle">恢复</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div> -->
        </div>
          <div class="content">
            <!-- <editor ref="editor" :show-tools="false" :active="false" v-model="article.articleContent"></editor> -->
            {{article.articleContent}}
          </div>
          <div class="handler">
            <show-num-component num="1" type="success">
              Like <i class="el-icon-thumb"></i>
            </show-num-component>
            <show-num-component num="1" >
              Collect <i class="el-icon-star-off"></i>
            </show-num-component>
          </div>
          <div class="tags">
            <tag-item v-for="tag in article.articleTags" :key="tag" :name="tag"></tag-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span><i class="el-icon-chat-line-round"></i> Latest Comment</span>
          </div>
          <div v-for="comment in article.articleComments" :key="comment.articleCommentId">
            <article-comment :easy="false" :comment="comment" @edit="onCommentEdit" @replay="onCommentReply" @del="onCommentDel"></article-comment>
            <el-divider></el-divider>
          </div>
          <!-- 回复文章正文 -->
          <article-comment-add ref="articleCommentAdd" @submit="onCommentReply({content: $event,commentId: 0})"></article-comment-add>
        </el-card>
      </template>
      <template slot="right">
        <el-card class="box-card menu-card">
          <div slot="header">
            <span>Dialog</span>
          </div>
          <!-- <el-tree
            class="filter-tree"
            :data="menus"
            :props="menuProps"
            default-expand-all
            @node-click="menuTreeClick"
            ref="tree">
            <span slot-scope="{ node, data }">
              {{data.label}} {{data.name}}
            </span>
          </el-tree> -->
        </el-card>
      </template>
    </home-layout>
  </div>
</template>

<script type="text/ecmascript-6">
  import ShowNumComponent from "../../components/forum/ShowNumComponent";
  import TagItem from "../../components/forum/TagItem";
  import Editor from "../../components/forum/Editor";
  import HomeLayout from "./components/HomeLayout";
  import UserInfoCard from "./components/UserInfoCard";
  import UserInfoShowCard from "./components/UserInfoShowCard";
  import ArticleComment from "./components/ArticleComment";
  import ArticleCommentAdd from "./components/ArticleCommentAdd";
  export default {
    name: "Article",
    components: {
      ArticleCommentAdd,
      ArticleComment,
      UserInfoShowCard, UserInfoCard, Editor, HomeLayout, TagItem, ShowNumComponent},
    data() {
      return {
        articleId: null,
        article:{
          articleId: null,
          articleTitle: null,
          articleContent: "",
          articleAddTime: null,
          articleUpdateTime: "",
          articleStatus: 0,
          articleComments:[],
          userDTO: {userNick: "",userFace: "",userId: null},
          articleTags: [],
          articleTopics: []
        },
        menus: [],
        menuProps:{
          children: 'children',
          label: 'name'
        }
      }
    },
    computed:{
      userInfo(){
        return this.$store.getters['User/getUserInfo'];
      },
      isMy(){
        return this.userInfo && this.userInfo.userId === this.article.userDTO.userId;
      }
    },
    watch:{
      "$route.query.commentId"(){
        this.goArticleComment();
      }
    },
    async mounted(){
      this.articleId = this.$route.params.articleId;
      // await this.addArticleView();
      //初始化文章数据
      // await this.getArticle();
      this.getArticle();


      //监听 class  CodeMirror-matching-topic 点击
      // this.$nextTick(()=>{
      //   let self = this;
      //   $('.CodeMirror-matching-topic').on('click',function(event){
      //     let name = $(this).text().substring(1,$(this).text().length - 1);
      //     self.$router.push({
      //       path: '/topic/' + name
      //     })
      //   });
      // })
    },
    methods: {
      handleCommand(command){
        if (command === "goEditArticle"){
          this.goEditArticle();
        }
        if (command === "delArticle"){
          this.saveArticleStatus(0);
        }
        if (command === "restoreArticle"){
          this.saveArticleStatus(1);
        }
      },
      addArticleView(){
        // return this.$store.dispatch('Article/addArticleView',this.articleId).then(res=>{
        // });
      },
      async getArticle() {
        // return this.$store.dispatch('Article/getArticle',this.articleId).then(res=>{
        //   this.article = res.data;
        //   this.$nextTick(()=>{
        //     // this.menus = this.$refs.editor.getMdMenu();
        //     this.goArticleComment();
        //   })
        // },err=>{
        //   this.$router.push({
        //     path: "/"
        //   });
        // })
        await this.$api.getArticle({article_id:this.articleId}).then(data=>{
            this.article =data.data;
            this.article.articleAddTime ='2023/09/20';
            this.article.articleTags =['Issue'];
          });
      },

      goEditArticle(){
        this.$router.push({
          path: "/writeArticle/" + this.article.articleId
        });
      },
      //去指定用户的用户页面
      goUserPage() {
        this.$router.push({
          path: "/user/" + this.article.userDTO.userId
        })
      },
      //去指定文章评论
      goArticleComment(){
        if (this.$route.query.commentId){
          let id = "comment-" + this.$route.query.commentId;

          this.$utils.scrollTo(id);
          console.log(id);
        }
      },
      saveArticleStatus(status){
        this.$store.dispatch('Article/saveArticleStatus',{
          articleId: this.articleId,
          articleStatus: status
        }).then(res=>{
          this.$message.success('EditSuccess');
          this.getArticle();
        })
      },


      menuTreeClick(data,node){
        this.$utils.scrollTo(data.id);
      },


      /**
       * 回复评论
       * @param content
       * @param commentId
       */
      onCommentReply({content,commentId}){
        let params = {
          articleId: this.article.articleId,
          // parentArticleCommentId: commentId,
          articleComment: content
        }

        //TODO POST 上传
        this.$api.addComment(params).then(()=>{
          this.$message.success("Success");
          this.getArticle();
        })

        // this.$store.dispatch("Comment/addArticleComment",params).then(res=>{
        //   this.$refs.articleCommentAdd.clearContent();
        //   this.$message.success("回复Success");
        //   this.getArticle();
        // })
      },

      /**
       * Edit评论
       * @param comment
       */
      onCommentEdit(comment){
        let params = {
          articleCommentId: comment.articleCommentId,
          articleComment: comment.articleComment
        }
        this.$store.dispatch("Comment/editArticleComment",params).then(res=>{
          this.$message.success("EditSuccess");
          this.getArticle();
        })
      },

      /**
       * Delete评论
       * @param comment
       */
      onCommentDel(comment){
        this.$confirm('此Operation将永久Delete该条评论, 是否继续?', '提示', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch("Comment/delArticleComment",comment.articleCommentId).then(res=>{
            this.$message.success("DeleteSuccess");
            this.getArticle();
          })
        });
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.article {
  .article-card{
    margin-bottom: 20px;
    flex-direction: column;
    position: relative;
    .article-card-header{
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .article-box{
        flex: 1;
        margin: 0 10px;

        > div{
          margin: 2px 0;
        }
        .title{
          font-size: 20px;
        }
        .info{
          color: var(--gray);
          font-size: 13px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .content{
      word-break: break-all;
    }
    .handler{
      text-align: center;
      .show-num-component + .show-num-component{
        margin: 20px 40px;
      }
    }
  }


  .article-card.delete-status{
    .article-card-header .article-box .title{
      text-decoration: line-through;
    }
  }
}
</style>
