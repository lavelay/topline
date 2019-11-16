<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改文章</span>
      </div>
      <div class="text item">
        <el-form ref="addRef" :rules="editFormRules" :model="editForm" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <quill-editor v-model="editForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="editForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
              <li @click="showDialog" class="uploadbox" v-for="item in imageNum" :key="item">
                <span>点击图标选择图片</span>
                <img v-if="editForm.cover.images[item-1]" :src="editForm.cover.images[item-1]" alt />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="频道" prop="channel_id">
            <channel-com @slt="selectHandler" :cid="editForm.channel_id"></channel-com>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editArticle(false)">修改</el-button>
            <el-button @click="editArticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
        <ul>
          <li class="image-box" v-for="item in imageList" :key="item.id">
            <img :src="item.url" alt="没有图片" @click="clkImage" />
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import ChannelCom from '@/components/channel'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'ArticleAdd',
  components: {
    quillEditor,
    ChannelCom
  },
  data () {
    return {
      imageList: [],
      querycdt: {
        collect: false,
        page: 1,
        per_page: 20
      },
      dialogVisible: false,
      editForm: {
        channel_id: '',
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        }
      },
      editFormRules: {
        title: [
          { required: true, message: '标题必须填写' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符之间' }
        ],
        content: [{ required: true, message: '内容必须填写' }],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      }
    }
  },
  created () {
    this.getArticle()
    this.getMaterial()
  },
  computed: {
    aid () {
      return this.$route.params.aid
    },
    imageNum () {
      if (this.editForm.cover.type > 0) {
        return this.editForm.cover.type
      } else {
        return 0
      }
    }
  },
  methods: {
    getMaterial () {
      this.$http
        .get('/mp/v1_0/user/images', { params: this.querycdt })
        .then(res => {
          if (res.data.message === 'OK') {
            // console.log(res)
            this.imageList = res.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获取素材失败' + err)
        })
    },
    showDialog () {
      this.dialogVisible = true
    },
    clkImage (e) {
      let lis = document.querySelectorAll('.image-box')
      for (let i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      e.target.parentNode.style.border = '4px solid blue'
    },
    selectHandler (v) {
      this.editForm.channel_id = v
    },
    getArticle () {
      this.$http
        .get(`/mp/v1_0/articles/${this.aid}`)
        .then(res => {
          if (res.data.message === 'OK') {
            this.editForm = res.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取信息错误' + err)
        })
    },
    editArticle (flag) {
      this.$refs.addRef.validate(valid => {
        if (valid) {
          this.$http
            .put(`/mp/v1_0/articles/${this.aid}`, this.editForm, {
              params: { draft: flag }
            })
            .then(res => {
              this.$message.success('修改文章成功!')
              this.$router.push('/article')
            })
            .catch(err => {
              return this.$message.error('修改失败' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor:pointer;
  box-sizing:border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
