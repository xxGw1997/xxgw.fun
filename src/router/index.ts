import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import generaterRoutes from 'pages-generated'
import NProgress from 'nprogress'


const routes: RouteRecordRaw[] = []

const modules = import.meta.globEager('./module/*.ts')
for (const path in modules) {
    routes.push(...modules[path].default)
}

routes.push(...generaterRoutes)

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to,from,next) => {
    NProgress.start()
    next()
})

router.afterEach(() => {
    NProgress.done()
})

export default router