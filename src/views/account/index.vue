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
      <div class="rt"></div>
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
        intro: ''
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
    editAccount () {},
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
    background-color: green;
  }
}
</style>
