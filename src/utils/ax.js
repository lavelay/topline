import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import JSONBig from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'

// 请求拦截器
axios.interceptors.request.use(config => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 相应拦截器
axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    router.push('/login')
  }
  return Promise.reject(error)
})

axios.defaults.transformResponse = data => {
  if (data) {
    return JSONBig.parse(data)
  } else {
    return data
  }
}

Vue.prototype.$http = axios
