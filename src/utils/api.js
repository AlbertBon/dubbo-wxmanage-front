import router from '../router'
import axios from 'axios'
import {Message} from 'element-ui'
import store from '../store'
import { getToken,removeToken } from '@/utils/auth'

axios.interceptors.request.use(config => {
  config.withCredentials = true;
  return config;
}, err => {
  Message.error({message: '请求超时!'});
  return Promise.resolve(err);
})
axios.interceptors.response.use(response => {
  const data = response.data;
  if (data.code && data.code != '00') {
    Message({
      message: data.message,
      type: 'error',
      duration: 5 * 1000,
      showClose:true,
    })
    if(data.code==='100007'){//登录信息过期
      store.commit('SET_TOKEN', '')
      store.commit('SET_ROLES', [])
      store.commit('REMOVE_TOKEN')
      router.push({path:'/login'});
    }
  }
  return response;
}, err => {
  if (err.response.status == 504 || err.response.status == 404) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'});
  } else if (err.response.status == 403) {
    Message.error({message: '权限不足,请联系管理员!'});
  } else {
    Message.error({message: '未知错误!'});
  }
  return Promise.resolve(err);
})

let base = process.env.BASE_API;

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
