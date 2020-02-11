import router, { asyncRouterMap }from '@/router/index.js'
import Layout from '@/views/layout/Layout'
const _import = require('@/router/_import_' + process.env.NODE_ENV)

var customRouter //全局路由变量

//路由拦截
router.beforeEach((to, from, next) => {
    if (!customRouter) {
        if(localStorage.getItem("router")) {
            customRouter = JSON.parse(localStorage.getItem("router"))
            // console.log("aaa:" + JSON.stringify(getRouter))

            let getRouter = filterAsyncRouter(customRouter)
            // console.log("bbb:" + JSON.stringify(getRouter))

            asyncRouterMap.splice(2)
            getRouter.forEach(r => {
                asyncRouterMap.push(r)
            })
            // console.log("ccc:" + JSON.stringify(asyncRouterMap))

            router.options.routes = asyncRouterMap
            router.addRoutes(asyncRouterMap)

            next({...to, replace: true})
        } else {
            next()
        }
    } else {
        next()
    }
})

export function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.hidden == 0) {
            route.hidden = false
        } else {
            route.hidden = true
        }

        if (route.component == 'Layout') {//Layout组件特殊处理
            route.component = Layout
        } else {
            route.component = _import(route.component)
        }

        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    return accessedRouters
}