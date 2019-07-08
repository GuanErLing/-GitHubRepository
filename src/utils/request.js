import axios from 'axios'
import store from "@/store"
import { getToken } from "@/utils/auth"
import { Message, MessageBox } from "element-ui"


// 创建 axios 实例
const service = axios.create({
    // url = base url + request url
    baseURL: process.env.VUE_APP_BASE_API,   
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        // 在发送请求之前做点什么 

        if(store.getters.token) {
            // 让每个请求携带令牌
            // ['X-Token']是自定义头密钥
            // 请根据实际情况修改
            config.headers['X-Token'] = getToken()
        }
        return config
    },
    error => {
        // 处理请求错误
        console.log(error)
        return Promised.reject(error)
    }    
)

// 响应拦截器
service.interceptors.response.use(
    /**
      *如果要获取HTTP信息，如头或状态
      *请返回 response => response
    */

    /**
      *通过自定义 code 确定请求状态
      *这只是一个例子
      *还可以通过HTTP状态代码判断状态
    */
   

    response => {
        const res = response.data

        // 如果自定义 code 不是20000，则判断为错误。
        if (res.code !== 20000) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008:非法令牌；50012:其他登录客户端；50014:令牌过期；
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // 重新登录
                MessageBox.confirm('您已注销，可以取消以留在此页，或重新登录', '确认注销', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log(error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service