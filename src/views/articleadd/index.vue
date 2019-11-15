<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <div class="text item">
        <el-form ref="addRef" :rules="addFormRules" :model="addForm" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <quill-editor v-model="addForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="addForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道" prop="channel_id">
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="addArticle(false)">发布</el-button>
            <el-button v-on:click="addArticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import ChannelCom from '@/components/channel';

import { quillEditor } from 'vue-quill-editor';
export default {
  name: 'ArticleAdd',
  components: {
    quillEditor,
    ChannelCom
  },
  data () {
    return {
      addForm: {
        channel_id: '',
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        }
      },
      addFormRules: {
        title: [
          { required: true, message: '标题必须填写' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符之间' }
        ],
        content: [{ required: true, message: '内容必须填写' }],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      }
    }
  },
  methods: {
    selectHandler (v) {
      this.addForm.channel_id = v
    },
    addArticle (flag) {
      this.$refs.addRef.validate(valid => {
        if (valid) {
          this.$http
            .post('/mp/v1_0/articles', this.addForm, {
              params: { draft: flag }
            })
            .then(res => {
              this.$message.success('发布文章成功!')
              this.$router.push('/article')
            })
            .catch(err => {
              return this.$message.error('发布失败' + err)
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
</style>