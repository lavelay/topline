<template>
  <el-select v-model="chid" clearable placeholder="请选择">
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'Channel',
  props: {
    cid: {
      default: 0
    }
  },
  data () {
    return {
      channelList: [],
      chid: ''
    }
  },
  watch: {
    chid (nv, ov) {
      this.$emit('slt', this.chid)
    },
    cid (nv, ov) {
      this.chid = nv
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
    getChannelList () {
      this.$http
        .get('/mp/v1_0/channels')
        .then(res => {
          // console.log(res)
          if (res.data.message === 'OK') {
            this.channelList = res.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获得频道错误:' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
