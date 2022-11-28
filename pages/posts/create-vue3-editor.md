---
title: 记录使用vue3来开发一个可视化编辑器
date: 2022-05-11T10:30:00.000+00:00
tags: ["Vue3", "Vue", "可视化编辑器"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

<!-- <blockquote>
前置知识：前端工程化 (Nodejs, npm...)，Vue.js (最好 >= 3.0)，TypeScript，基本的 markdown 编写能力。
</blockquote> -->

## 如何搭建一个静态网站？

之前接触过 hexo，了解了大致的个人网站的搭建，但是那个是别人已经搭建好的，后面看见[Antony Fu](https://github.com/antfu) 大佬的 [个人网站](https://antfu.me/)，并且自己的技术栈是 vue 周边的，所以想要使用 vue3 和 vite2，并且使用比较新的技术从 0 开始去搭建个人网站。网站在完成搭建后，后续只需要在 markdown 写文章，然后通过 vite 的插件将 markdown 转换成静态的 html 页面，并自动生成对应的路由页面。所以这篇文章实际上将要介绍的是如何构建一个自动化的静态网站生成器，就像 [VuePress](https://vuepress.vuejs.org/), [Hexo](https://hexo.io/) 那样。

主要用到的技术栈：

- 基于 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 和 <div i-logos:vue /> [Vue.js - 3.0](https://v3.vuejs.org/)，支持 <vscode-icons-file-type-typescript-official /> [TypeScript](https://www.typescriptlang.org/)
- 基于文件系统的 <tabler-route /> 路由
- 支持 <ri-markdown-line /> Markdown 组件, 可以在 Markdown 中使用 Vue 组件
  <!-- - 纯粹的 <bx-bxs-file-html /> 静态页面，支持 <uil-server /> 服务端生成 -->

接下来逐步记录每个所用到的插件

## 首先生成一个 Vite 项目

生成一个 Vite 项目 (Vite requires Node.js version >=12.2.0.):

```bash
$ pnpm create @vite
```

终端敲下命令,短时间加载后需要输入项目的名称,选择 Vue 框架的 js 版本(因为要用到 jsx 去编写组件,ts 用的还不是很熟练,所以先暂时用 js),然后 cd 进入项目目录，安装依赖后启动项目。

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
```

这里还要添加一个插件<code>[@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)</code>,因为后续编写组件时,需要用到 jsx 来编写,jsx 相比传统的 vue 的 template 来说会更加灵活一些。

```bash
$ npm i @vitejs/plugin-vue-jsx
```

```js
// vite.config.js
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [
    // other options
    vueJsx()
  ],
});





大致步骤
1、从选择组件选择区域选择组件拖拽到画布
  - 将配置好的组件文件渲染成对应组件,并且每个组件都绑定对应 dragstart,dragend监听事件..在dragend时将
  - 选择组件时触发对应的dragstart函数,dragstart函数中做的是为画布元素添加dragenter,dragover,dragleave,drop四个事件,分别表示当拖拽目标进入画布时将鼠标指针设置为可移动,当拖拽目标在画布上移动时需要阻止默认事件冒泡,当拖拽元素离开时将鼠标指针设置为不可放置,当拖拽目标放在画布上时将画布上的组件信息进行动态更新,并且将当前元素置为null.
2、 画布中组件进行选择/多选,进行拖拽并且在相近的block组件时显示对齐辅助线
  - 对画布中每个组件block添加onMousedown事件,在点击该block时,为该block添加focus属性为true（focus属性的作用是用来表示画布中哪些block被选中,如果focus是true的block外层会有线包裹住）并且再次点击时置为false.当点击其他block时,先将所有block的focus置为false,然后再将当前点击的block的focus设置为true,如果是按住ctrl键选择,则不需要要将其他的block的focus设置为false,直接将当前的block的focus也设置为true即可.并且将当前点击的block的index记录下来,为之后的辅助线对齐功能保存数据.除了这些之外还需要保存当前鼠标的x,y的值;选中元素的left,top值;以及所有选中了的block的top和left值。以及要动态计算所有未被选中的block应该显示辅助线的位置坐标信息。辅助线分别有x线和y线两条方向的线需要记录.然后再添加鼠标拖拽移动和鼠标松开的事件
  - mousmove事件, 事件触发时需要将选中元素中那个鼠标点击的元素与其他未选中的所有元素进行对比辅助线的信息,如果x线或者y线与点击元素的位置小于5,则需要添加自动吸附的功能,并且将此时的辅助线的x值或者y值进行赋值,没有符合的话x值或y值为null,这个值会在画布中显示对应的辅助线,如果x或y不为null则会显示到对应的位置.然后还需要将所有选中的block的top值和left随移动的位置进行动态变化.
  - mouseup事件, 事件触发时说明鼠标已经松开,则需要把对应注册的事件移除监听.并且将辅助线清空.
```
