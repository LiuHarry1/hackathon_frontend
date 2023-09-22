<template>
    <div class="home">
      <!--<hitokoto></hitokoto>-->
      <home-layout>
        <template slot="left">
          <el-card class="box-card article-list-card">
            <tab-component slot="header" @change="onChangList" :list="tabs" v-model="activeTab" style="padding: 10px"></tab-component>
            <article-card v-for="(item,index) in datas" :article="item" easy :key="index"></article-card>
            <page ref="page" @change="loadList"></page>
          </el-card>

        </template>
      </home-layout>
      <div class="chatbot" @click="dialogVisible=true">
      </div>
      <el-dialog
        title="Chat Bot"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal='false'
        >
        <div style="height:40vh">
        <el-scrollbar style="height:40vh" :horizontal="false">
          <div v-for="(item,index) in msglist" :key="index">
            <ChatMsg :msg="item"></ChatMsg>
          </div>
        </el-scrollbar>
      </div>
        <span slot="footer" class="dialog-footer">
          <el-input class="diainput" v-model="chat"></el-input>
          <el-button @click="closeChat">Cancel</el-button>
          <el-button type="primary" @click="sendMsg">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </template>

  <script type="text/ecmascript-6">
    // import UserInfoCard from "./components/UserInfoCard";
    import ArticleCard from "./components/ArticleCard";
    import TabComponent from "../../components/forum/TabComponent";
    import HomeRight from "./HomeRight";
    import HomeLayout from "./components/HomeLayout";
    import Page from "../../components/forum/Page";
    import Hitokoto from "../../components/forum/Hitokoto";
    import ChatMsg from "../../components/forum/ChatMsg.vue"

    import axios from 'axios'; // Import Axios
    import { BASE_AIURL } from '../../config';


    export default {
      name: "Home",
      metaInfo: {
        title: 'Forum',
      },
      components: {ChatMsg
        ,Hitokoto, Page, HomeLayout, HomeRight, TabComponent, ArticleCard},
      data() {
        return {
          images: [
            {title: "xxxxx系统1111", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579600299787&di=faa9b4e409538e1d96c36994b839c934&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F20%2F62%2F01000000000000119086280352820.jpg"},
            {title: "xxxxx系统2222", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579600299787&di=faa9b4e409538e1d96c36994b839c934&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F20%2F62%2F01000000000000119086280352820.jpg"},
            {title: "xxxxx系统3333", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579600299787&di=faa9b4e409538e1d96c36994b839c934&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F20%2F62%2F01000000000000119086280352820.jpg"},
            {title: "xxxxx系统4444", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579600299787&di=faa9b4e409538e1d96c36994b839c934&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F20%2F62%2F01000000000000119086280352820.jpg"},

          ],
          activeTab: "new",
          tabs:[
            {label: "Latest",value: "new"},
            {label: "Hot",value: "hot"}
          ],

          datas: [],
          dialogVisible:false,
          msglist:[],
          chat:''
        }
      },
      watch:{
        // "$route.query"(){
        //   this.loadList();
        // }
      },
      mounted(){
        this.loadList();
      },
      methods: {
        onChangList(item){
          this.activeTab = item.value;
          this.loadList();
        },

        loadList(){
          if (this.activeTab === "new"){
            this.list();
          }else if (this.activeTab === "hot"){
            this.list();
          }
        },
        async list(){
          // let params = this.$refs.page.getPage();

          await this.$api.getArticleList().then(data=>{
            this.datas =data.data;
          });
        //   GET 请求文章列表
        //   this.$store.dispatch('Article/getArticles',params).then(res=>{
        //     this.datas = res.data.records;
        //     this.$refs.page.setPage(res.data);
        //   })
        },
        hotList(){
          let params = this.$refs.page.getPage();
        //   this.$store.dispatch('Article/getHotArticles',params).then(res=>{
        //     this.datas = res.data.records;
        //     this.$refs.page.setPage(res.data);
        //   })
        },
        async sendMsg(){
          let temp ={
            user:'user',
            msg:this.chat
          };
          this.msglist.push(temp);
          //TODO api
          const requestData = {
          query: this.chat, // 你的查询字符串
          };


            // axios
            // .post("http://localhost:9600/ai_service/faq",requestData)
            // .then((response) => {
            //   // console.log(response);
            //   this.msglist.push({user: 'bot', msg: response.data.answer});
            // })
              // this.comments = response.data.comments;
              // this.showComments = true;
            // .catch((error) => {
            //   console.error('Error fetching comments:', error);
            // });

          try{
            await this.$api.getanswer(
            requestData
          ).then(data=>{
            this.msglist.push({user:'bot',msg:data.answer});
          })
          }catch (error) {
            console.error('请求出错：', error);
          };

          this.chat ='';
        },

        closeChat(){
          this.msglist =[];
          this.chat ='';
          this.dialogVisible =false;
        }

      },
    }
  </script>

  <style lang="stylus" rel="stylesheet/stylus">
  .home {
      .article-list-card{
          .el-card__header{
            padding: 0;
          }
          .el-card__body{
            padding: 0;
          }
          .article-card{
            padding:  10px;
          }
    }
      .chatbot{
        position: fixed;
        right: 20px;
        bottom: 100px;
        width: 200px;
        height: 160px;
        background-image: url('../../../public/bot.png');
      }
      .content-box{
        line-height: 30px;
      }
      .diainput{
        margin-bottom: 20px;
      }

  }
  /*
  .layout.route-home {
    margin-top: 50px;
  }
  */
  </style>
