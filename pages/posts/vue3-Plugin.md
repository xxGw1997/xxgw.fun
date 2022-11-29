---
title: Vue3 插件
date: 2022-11-27T20:30:00.000+00:00
tags: ["Vue3", "Vue", "插件"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## Vue 插件

插件是自包含的代码，通常向 Vue 添加全局级功能。<br/>
插件可以是一个对象或者是一个函数

- 如果是一个对象需要有 install 方法,Vue 会帮你自动调用到 install 方法,注入到 Vue 道中。
- 如果是一个 function 就则 Vue 会把这个 fn 直接当 install 方法去使用。

### 实现一个全局 Loading 插件

_components/Loading/index.vue_

```js
<script setup lang="ts">
import { ref, defineExpose } from "vue";
const isShow = ref<boolean>(false);

const show = () => (isShow.value = true);

const hide = () => (isShow.value = false);

// 将内部数据暴露出去,以供外部使用
defineExpose({
  show,
  hide,
  isShow,
});
</script>

<template>
  <div v-if="isShow" class="loading">Loading...</div>
</template>

<style scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
}
</style>

```

_components/Loading/index.ts_

```js
import type { App, VNode } from "vue";
import Loading from "./index.vue";
import { createVNode, render } from "vue";

//需要导出一个对象,对象当中必须要有一个install方法
export default {
  // 在Vue中使用插件时,Vue会将其实例传进来
  install(app: App) {
    //createVNode => 将.vue结尾的组件创建一个虚拟Dom,Vnode
    const Vnode: VNode = createVNode(Loading);
    //render => 将虚拟Dom生成真实Dom,并且挂载到body上
    render(Vnode, document.body);
    // 通过vue实例app 进行全局方法的挂载
    app.config.globalProperties._loading = {
      show: Vnode.component?.exposed?.show,
      hide: Vnode.component?.exposed?.hide,
    };
  },
};
```

main.ts

```js
import { createApp } from 'vue'
import App from './App.vue'
import Loading from './components/Loadiing'


type Lod = {
  show: () => void,
    hide: () => void
}
//声明扩展类型
declare module 'vue' {
    export interface ComponentCustomProperties {
        _loading: Lod
    }
}
// 使用use方法将插件传入Vue中
createApp(App).use(Loading).mount('#app')
```

在 App.vue 中使用

```js
<script setup lang="ts">
import { getCurrentInstance } from "vue";
// 由于Vue3当中没有this了,所以需要 getCurrentInstance 方法获取当前实例
const instance = getCurrentInstance();
const showLoading = () => {
  //通过当前vue实例调用初始化时所注入的方法
  instance?.proxy?._loading.show();
};

setTimeout(() => {
  instance?.proxy?._loading.hide();
}, 3000);
</script>

<template>
  <div>
    <div @click="showLoading">showLoading</div>
  </div>
</template>
```

## 自己实现一个 Vue.use()方法

myUse.ts

```js
import type { App } from 'vue'
import { app } from './main'
interface Use {
    install: (app: App, ...options: any[]) => void
}

// 以防重复注册
const installList = new Set()
export function myUse<T extends Use>(plugin: T, ...options: any[]) {
    // 如果没有添加过,则做注册插件操作,并且将插件添加到installList中
    if (!installList.has(plugin)) {
      plugin.install(app, ...options)
      installList.add(plugin)
    }
    // 最终返回当前实例,可实现链式调用
    return app
}
```
