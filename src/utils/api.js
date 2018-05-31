import axios from 'axios'
import {Message} from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// // 创建axios实例
// const service = axios.create({
//   baseURL: process.env.BASE_API, // api的base_url
//   timeout: 15000 // 请求超时时间
// })
//
// // request拦截器
// service.interceptors.request.use(config => {
//   if (store.getters.token) {
//     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//   }
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })
//
// // respone拦截器
// service.interceptors.response.use(
//   response => {
//     /**
//      * code为非00是抛错 可结合自己业务进行修改
//      */
//     const res = response.data
//     if (res.code !== '00') {
//       Message({
//         message: res.message,
//         type: 'error',
//         duration: 5 * 1000
//       })
//
//       // // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//       // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//       //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//       //     confirmButtonText: '重新登录',
//       //     cancelButtonText: '取消',
//       //     type: 'warning'
//       //   }).then(() => {
//       //     store.dispatch('FedLogOut').then(() => {
//       //       location.reload()// 为了重新实例化vue-router对象 避免bug
//       //     })
//       //   })
//       // }
//       return Promise.reject('error')
//     } else {
//       return response.data
//     }
//   },
//   error => {
//     console.log('err' + error)// for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
//
// export default service

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
      duration: 5 * 1000
    })
    return;
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
