<template>
  <div :class="isUser?'chatmsg':'bot-chatmsg'">
    <el-avatar :src=link ></el-avatar>
    <div class="info">
        {{ this.chatmsg }}
    </div>
   
  </div>
</template>


<script>
import botimg from "../../../public/bot-small.png"
export default {
    name:'Chatmsg',
    props:{
        msg:Object
    },
    data(){
        return{
            chatmsg:null,
            link:'',
            isUser:true
        }
    },
    methods:{

    },
    mounted(){
        if(this.msg.user==='user'){
            this.isUser =true;
            this.link="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
        }else{
            this.isUser=false;
            this.link =botimg;
        }
        this.chatmsg =this.msg.msg;
        // console.log(this.chatmsg);
    }
}
</script>

<style>
.chatmsg{
    display: flex;
    align-items: center;
    width: 100%;
    /* background-color: #fff0f0; */
    margin-bottom: 10px;
}
.info{
    width: 80%;
    margin-left: 20px;
}
.bot-chatmsg{
    display: flex;
    flex-direction:row-reverse;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* background-color: #fff0f0; */
    margin-bottom: 10px;
    padding-left: 40px;
}
</style>