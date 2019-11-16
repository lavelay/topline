<template>
  <el-container>
    <el-aside :width="flag?'65px':'200px'">
      <el-menu
        background-color="#323745"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="flag"
        :collapse-transition="false"
        :router="true"
      >
        <el-menu-item
          index="/welcome"
          @click.native="$router.push('/welcome')"
          :style="{width:flag?'65px':'200px'}"
        >
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <el-submenu index="2" :style="{width:flag?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/articleadd">发布文章</el-menu-item>
          <el-menu-item index="/article">文章列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="/material">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :style="{width:flag?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/account" :style="{width:flag?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="left">
          <i @click="flag=!flag" :class="flag?'el-icon-s-unfold':'el-icon-s-fold'"></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div class="right">
          <el-input style="width:240px;" v-model="search" placeholder="请输入内容">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 20px">消息</span>
          <el-dropdown :hide-on-click="false" trigger="click">
            <span class="el-dropdown-link">
              <img width="40" style="margin-right:10px;border-radius:50%;" :src="photo" alt />
              {{ name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>github</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import bus from '@/utils/bus.js'

export default {
  name: 'homeCom',

  created () {
    bus.$on('nm', v => {
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.name = v
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      this.tempname = v
    })
    bus.$on('pt', v => {
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = v
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      this.tempphoto = v
    })
  },
  methods: {
    logout () {
      this.$confirm('确定退出系统么？~~~', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  },
  data () {
    return {
      flag: false,
      tempname: '',
      tempphoto: '',
      search: ''
    }
  },
  computed: {
    name () {
      return this.tempname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return this.tempphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: #323745;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 0 10px;
    min-width: 800px;
    .left {
      height: 100%;
      width: 40%;
      font-size: 18px;
      display: flex;
      align-items: center;
    }
    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      width: 50%;
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
  }
  .el-main {
    background-color: lightgreen;
  }
}
</style>
