<template>
  <div class="container">
    <div class="login-box">
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules">
        <img src="./logo_index.png" alt />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
            <i slot="prefix" class="el-input__icon el-icon-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码">
            <i slot="prefix" class="iconfont icon-yanzhengma"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi">
            <span>我以阅读并同意用户协议和隐私条款</span>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="isActive"
            :disabled="isActive"
            style="width:100%;"
            @click="login()"
          >登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'
import '@/assets/iconfont/iconfont.css'
export default {
  data () {
    var xieyiText = function (rule, value, callback) {
      value ? callback() : callback(new Error('请遵守条款'))
    }
    return {
      catObj: null,
      isActive: false,
      loginForm: {
        mobile: '18838460702',
        code: '246810',
        xieyi: false
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必须填写' },
          { pattern: /^1[356789]\d{9}$/, message: '手机格式不正确' }
        ],
        code: [{ required: true, message: '验证码必须填写' }],
        xieyi: [{ validator: xieyiText }]
      }
    }
  },
  created () {
    let that = this
    document.onkeypress = function (e) {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        that.login()
        return false
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          if (this.catObj !== null) {
            return this.catObj.verify()
          }
          this.isActive = true
          // 人机交互验证
          this.$http
            .get(`/mp/v1_0/captchas/${this.loginForm.mobile}`)
            .then(res => {
              // console.log(res)
              let { data } = res.data
              window.initGeetest(
                {
                  // 以下配置参数来自服务端 SDK
                  gt: data.gt,
                  challenge: data.challenge,
                  offline: !data.success,
                  new_captcha: true,
                  product: 'bind'
                },
                captchaObj => {
                  // 这里可以调用验证实例 captchaObj 的实例方法
                  captchaObj
                    .onReady(() => {
                      captchaObj.verify()
                      this.catObj = captchaObj
                      this.isActive = false
                    })
                    .onSuccess(() => {
                      this.loginAct()
                    })
                    .onError(() => {
                      // your code
                    })
                }
              )
            })
            .catch(err => {
              return this.message.error('获得人机交互验证信息有误') + err
            })
        }
      })
    },
    // 表单真实性校验
    loginAct () {
      this.$http
        .post('/mp/v1_0/authorizations', this.loginForm)
        .then(res => {
          if (res.data.message !== 'OK') return
          sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
          this.$router.push({ name: 'home' })
        })
        .catch(err => {
          // return alert('用户名或密码错误' + err)
          // return this.$message.error('用户名或密码错误' + err)
          return this.$message({
            type: 'error',
            message: '用户名或密码错误' + err,
            duration: 1000
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: url("./login_bg.jpg");
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: gray;
  .login-box {
    width: 400px;
    height: 340px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    img {
      width: 60%;
      margin: 20px auto;
    }
    .el-form {
      width: 75%;
    }
  }
}
</style>
