<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图片管理</span>
        <el-upload
          :headers="setToken"
          style="float: right; padding: 3px 0"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          name="image"
          :show-file-list="false"
          :on-success="onSuccess"
        >
          <el-button size="small" type="primary">上传素材</el-button>
        </el-upload>
      </div>
      <div class="text item">
        <ul>
          <li class="image-box" v-for="item in imageList" :key="item.id">
            <img :src="item.url" alt />
            <div class="image-bot">
              <el-button type="success" icon="el-icon-star-off" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Material',
  data () {
    return {
      querycdt: {
        collect: false,
        page: 1,
        per_page: 20
      },
      imageList: []
    }
  },
  created () {
    this.getMaterial()
  },
  computed: {
    setToken () {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return { Authorization: 'Bearer ' + token }
    }
  },
  methods: {
    onSuccess () {
      this.$message.success('上传图片成功！！')
      this.getMaterial()
    },
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
    }
  }
}
</script>

<style lang="less" scoped>
// 素材图片列表样式
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>
