import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constallRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    name: 'HelloWorld',
    component: () => import('@/components/HelloWorld')
  }
]

const createRouter = () => new Router({
  routes: constallRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router


// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
