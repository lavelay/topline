<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio-group @change="getArticleList()" v-model="searchForm.status">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表：">
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ total_art }}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="articleList" stripe>
          <el-table-column label="图标">
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              alt="图片丢了"
              width="150"
              height="100"
            />
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发表时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <el-button
                type="primary"
                size="mini"
                @click="$router.push(`/articleedit/${stData.row.id}`)"
              >修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text item">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_art"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import ChannelCom from '@/components/channel';
export default {
  name: 'ArticleList',
  components: {
    ChannelCom
  },
  watch: {
    searchForm: {
      handler: function (newv, oldv) {
        this.getArticleList()
      },
      deep: true
    },
    time (nv, ov) {
      if (nv) {
        this.searchForm.begin_pubdate = nv[0]
        this.searchForm.end_pubdate = nv[1]
      } else {
        this.searchForm.begin_pubdate = '';
        this.searchForm.end_pubdate = '';
      }
    }
  },
  data () {
    return {
      time: '',
      total_art: 0,
      articleList: [],
      searchForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10
      }
    }
  },
  created () {
    this.getArticleList()
  },
  methods: {
    selectHandler (v) {
      this.searchForm.channel_id = v
    },
    del (id) {
      this.$confirm('确定要删除此文章吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$http
            .delete(`/mp/v1_0/articles/${id}`)
            .then(res => {
              this.getArticleList()
            })
            .catch(err => {
              return this.$message.error('删除文章失败' + err)
            })
        })
        .catch(() => {})
    },
    handleSizeChange (v) {
      this.searchForm.per_page = v
      this.getArticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getArticleList()
    },

    getArticleList () {
      let searchData = {}
      for (var k in this.searchForm) {
        if (this.searchForm[k]) {
          searchData[k] = this.searchForm[k]
        }
      }
      this.$http
        .get('/mp/v1_0/articles', { params: searchData })
        .then(res => {
          if (res.data.message === 'OK') {
            // console.log(res)
            let { results, total_count } = res.data.data
            this.articleList = results
            this.total_art = total_count
          }
        })
        .catch(err => {
          return this.$message.error('获得文章错误:' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
