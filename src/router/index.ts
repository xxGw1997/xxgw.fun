import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import generaterRoutes from 'pages-generated'


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

export default router