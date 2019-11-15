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
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  methods: {
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
</style>
