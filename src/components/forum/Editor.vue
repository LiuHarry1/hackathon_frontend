<template>
  <div class="Editor" :class="active?'content-mode':'edit-mode'">
    <div class="tools-bar" v-if="showTools">
      <ul class="tools left" :class="active ? 'disabled': ''">
        <li><slot name="tools-head"></slot></li>
        <li @click="insertContent('# ')" title="Title" >H</li>
        <li @click="insertContent('**Text**')" title="Bold" style="font-weight: bold;">B</li>
        <li @click="insertContent('*Text*')" title="Italic" style="font-style: italic;">I</li>
        <li @click="insertContent('~~Text~~')" title="Line-through" style="text-decoration: line-through;">S</li>
        <li @click="insertContent('[Text](URL)')" title="Link">A</li>
        <li style="position: relative;">
          <i class="el-icon-picture-outline" title="Picture"></i>
          <input style="opacity:0;width:100%;height:100%;position:absolute;top:0;left:0"  type="file" @change="fileUpload">
        </li>
        <li @click="insertContent('```\n' + '\n' + '```')" title="Code Block">{}</li>
        <li @click="insertContent('#Topic# ')" title="Topic">#</li>

      </ul>
      <ul class="tools right hidden-xs-only" :class="active ? 'disabled': ''">
        <li>
          <!-- <el-popover
          placement="bottom"
          trigger="click">
          <el-tree
            class="filter-tree"
            :data="menus"
            :props="menuProps"
            default-expand-all
            @node-click="menuTreeClick"
            ref="tree">
          </el-tree>
          <i slot="reference" @click="getMdMenu" class="el-icon-reading"></i>
        </el-popover> -->
        </li>
        <li>
          <el-switch
            class="my-el-switch"
            v-model="active"
            active-text="Preview">
          </el-switch>
        </li>
      </ul>
    </div>

    <div v-if="active" class="markdown-body" v-html="contentRender">
    </div>
    <codemirror
      v-else
      ref="editor"
      v-model="content"
      :options="cmOptions"
      class="code">
    </codemirror>
  </div>
</template>

<script type="text/ecmascript-6">
  import { codemirror } from 'vue-codemirror'

  export default {
    name: "Editor",
    components:{
      codemirror
    },
    data() {
      return {
        content: null,
        contentRender: null,
        cmOptions: {
          value:'',
          mode: 'markdown',
          theme: "default",
          lineNumbers: this.lineNumbers,
          lineWrapping: true,  // 长句子折行
          highlightFormatting: true,
          extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"},
          tabSize: 2, // tab
          styleActiveLine: true, // 高亮选中行
          matchTopics: this.matchTopics,
          placeholder: this.placeholder,
          readOnly: false, // 确保 readOnly 为 false，允许Edit
        },
        menus: [],
        menuProps:{
          children: 'children',
          label: 'name'
        }
      }
    },
    props:{
      value: String,
      active: {
        type: Boolean,
        default: false
      },
      showTools: {
        type: Boolean,
        default: true
      },
      matchTopics: {
        type: Function,
        default: (result)=>{}
      },
      placeholder:{
        type: String,
        default: "Please enter the content"
      },
      //显示行号
      lineNumbers: {
        type: Boolean,
        default: true
      },
    },

    watch: {
      value(val){
        this.content = val;
      },
      content(val){
        this.$emit('input',val)
        if (this.active){
          this.renderMd();
        }
      },
      active(val){
        if (val){
          this.renderMd()
        }
      }
    },
    mounted(){
      this.content = this.value;
      console.log(this.value);
      if (this.active){
        this.renderMd();
      }
      // if (!this.active){
      //   this.$nextTick(()=>{
      //     this.refresh();
      //   })
      // }

    },
    methods: {
      insertContent(content) {
        let cm = this.$refs.editor.codemirror;
        cm.replaceSelection(content);
      },
      //EditEdit方式
      renderMd(){
        let md = require('../../vendor/markdown/').default;
        this.contentRender = md.render(this.content);

      },
      menuTreeClick(data,node){
        this.$utils.scrollTo(data.id);
        // window.location.hash = data.id;
      },

      //获取md目录
      getMdMenu(maxLevel=null){
        //覆盖一行一行匹配
        let reg = /^\s*(#+)\s+(.*)[\s]*/gm;
        let result = this.content.match(reg);
        console.log(result);
        if (!result){
          return [];
        }
        let menus = [];
        let nums = {};

        let index = 0;
        for (let value of result){
          value = value.replace(/^\s*[^#]/,'');
          value = value.replace(/\s*$/,'');
          //Confirm级别
          let arr = value.split('#');
          let level = arr.length - 1;
          //验证是否到达最大级别
          if (maxLevel != null && level > maxLevel) continue;

          let data = {
            index: level === 1 ? ++index : index,
            level: level,
            name: value.replace(/^\s*#+\s*/,''),
            children: []
          }
          //id用于跳转
          let id = "menu-" + data.index + "-";
          if (level === 1){
            //同时要给元素加id=
            id += level + "-" + (menus.length + 1);
            data.id = id;
            data.label = data.index + "." + level + "." + 1;
            menus.push(data);
          }else{
            let lastMenu = this.getLastMenuByLevel(menus,level - 1);
            if (!lastMenu) continue;
            id += level + "-" + (lastMenu.children.length + 1);
            data.id = id;
            data.label = data.index + "." + level + "." + (lastMenu.children.length + 1);
            lastMenu.children.push(data);
          }
          nums[level] = nums[level] ? nums[level] : 0;
          //给元素Add id
          let node = $(".markdown-body h" + level).eq(nums[level]++);
          $(node).attr("id",id);
        }
        this.menus = menus;
        return menus;
      },
      getLastMenuByLevel(menus,level){
        let lastMenu = menus[menus.length - 1];
        if (lastMenu.level === level){
          return lastMenu;
        }else{
          if (lastMenu.children.length === 0){
            return lastMenu;
          }
          return this.getLastMenuByLevel(lastMenu.children,level);
        }
      },


      //文件上传
      fileUpload(e){
        let files = e.target.files;
        if (files.length === 0){
          this.$message.info("PleaseSelect图片");
          return;
        }
        let file = files[0];
        this.$store.dispatch("uploadImage",file).then(res=>{
          let name = file.name;
          //过滤文件名包含的特殊字符
          name = name.replace(/\(|\)|\[|\]/g,"");
          this.insertContent("![" + name + "](" + res.data + ")");
        })
        console.log('fileUpload',file);
      },


      refresh() {
        this.$refs.editor.refresh();
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.Editor {
  .markdown-body{
    min-height: auto;
  }
  .tools-bar{
    display: flex;
    flex-wrap: wrap;
  }
  .tools{
    flex: 1;
    position: relative;
    font-size: 15px;
    margin: 0;
    padding: 10px;
    list-style: none;
    border-bottom: 1px solid #ebeef5;
    /*padding-right: 140px;*/
    li{
      display: inline-block;
    }
    li + li{
      margin: 0 10px;
      cursor: pointer;
    }
  }
  .tools.right{
    text-align: right;
  }
}
</style>
