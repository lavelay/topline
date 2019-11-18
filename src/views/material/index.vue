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
        <ul class="clearfix">
          <li class="image-box" v-for="item in imageList" :key="item.id">
            <img :src="item.url" alt />
            <div class="image-bot">
              <el-button
                type="success"
                @click="imgCollect(item.id,item.is_collected)"
                :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                circle
              ></el-button>
              <el-button type="danger" @click="imgDel(item.id)" icon="el-icon-delete" circle></el-button>
            </div>
          </li>
        </ul>
      </div>
      <div class="text item">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.page"
          :page-sizes="[8,12,16,20]"
          :page-size="querycdt.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_art"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Material',
  data () {
    return {
      total_art: 0,
      querycdt: {
        collect: false,
        page: 1,
        per_page: 8
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
    imgDel (id) {
      this.$confirm('确定删除此图片吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(`/mp/v1_0/user/images/${id}`)
            .then(res => {
              if (res.status === 204) {
                this.$message.success('删除图片成功!!')
                this.getMaterial()
              }
            })
            .catch(err => {
              return this.$message.error('删除图片失败' + err)
            })
        })
        .catch(() => {})
    },
    imgCollect (id, isCollect) {
      isCollect = !isCollect
      this.$http
        .put(`/mp/v1_0/user/images/${id}`, { collect: isCollect })
        .then(res => {
          if (res.data.message === 'OK') {
            isCollect
              ? this.$message.success('收藏图片成功！！')
              : this.$message.success('取消收藏成功！！')
            this.getMaterial()
          }
        })
        .catch(err => {
          return this.$message.error('收藏图片失败' + err)
        })
    },
    handleSizeChange (v) {
      this.querycdt.per_page = v
      this.getMaterial()
    },
    handleCurrentChange (v) {
      this.querycdt.page = v
      this.getMaterial()
    },
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
            let { results, total_count } = res.data.data
            this.total_art = total_count
            this.imageList = results
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
.clearfix::after {
  content: "";
  visibility: hidden;
  clear: both;
  display: block;
}
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
