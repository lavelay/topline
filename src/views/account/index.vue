<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账号信息</span>
    </div>
    <div class="text item acc">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :rules="accountFormRules"
          :model="accountForm"
          label-width="100px"
        >
          <el-form-item label="用户名:" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介:">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">
        <p>点击上传用户头像</p>
        <el-upload action :show-file-list="false" :http-request="httpRequest">
          <img
            width="150"
            height="150"
            v-if="accountForm.photo"
            :src="accountForm.photo"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        name: '',
        email: '',
        mobile: '',
        intro: '',
        photo: ''
      },
      accountFormRules: {
        name: [
          { required: true, message: '用户名必须填写' },
          { min: 1, max: 7, message: '名字长度应为1-7个字符' }
        ],
        email: [
          { required: true, message: '邮箱必须填写' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  created () {
    this.getAccount()
  },
  methods: {
    httpRequest (resource) {
      let fd = new FormData()
      fd.append('photo', resource.file)
      this.$http
        .patch('/mp/v1_0/user/photo', fd)
        .then(resource => {
          if (resource.data.message === 'OK') {
            this.accountForm.photo = resource.data.data.photo
            this.$message.success('上传图片成功！！！')
          }
        })
        .catch(err => {
          return this.$message.error('上传图片失败' + err)
        })
    },
    editAccount () {
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          this.$http
            .patch('/mp/v1_0/user/profile', this.accountForm)
            .then(res => {
              if (res.data.message === 'OK') {
                this.$message.success('更新账户成功!!!')
              }
            })
            .catch(err => {
              return this.$message.error('更新账户错误' + err)
            })
        }
      })
    },
    getAccount () {
      this.$http
        .get('/mp/v1_0/user/profile')
        .then(res => {
          if (res.data.message === 'OK') {
            this.accountForm = res.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取信息错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.acc {
  display: flex;
  justify-content: space-between;
  .lt {
    width: 50%;
  }
  .rt {
    width: 30%;
  }
}
</style>
