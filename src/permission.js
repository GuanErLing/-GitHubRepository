import router from './router'
import store from './store'
import { Message } from "element-ui";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth';
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login']  // 没有重定向

router.beforeEach(async (to, from, next) => {
    // 初始化进度条
    NProgress.start()

    // 设置页面标题
    document.title = getPageTitle(to.meta.title)

    // 确认用户是否已经登录
    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/login') {
            // 如果用户已经登录，重定向去首页
            next({ path: '/'})
            NProgress.done()
        } else {
            const hasGetUserInfo = store.getters.name
            if (hasGetUserInfo) {
                next()
            } else {
                try {
                    // 获取用户信息
                    await store.dispatch('user/getInfo')
                    next()
                } catch (error) {
                    // 移除 token,并转到登录页重新登录
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        // 没有 token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单中，直接进入
            next()
        } else {
            // 其它没有访问权限的页面将重定向到登录页面
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

