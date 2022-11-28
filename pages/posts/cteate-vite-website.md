---
title: 使用Vite2 + Vue3 构建个人网站
date: 2022-04-30T17:00:00.000+00:00
tags: ["Vite2", "Vue3", "Vue", "个人网站搭建"]
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

Vite 是 2020 年 [Evan You](https://github.com/yyx990803) 为我们带来的一个下一代前端开发与构建工具。天下苦 webpack 久矣，就是快，非常快。

生成一个 Vite 项目 (Vite requires Node.js version >=12.2.0.):

```bash
$ pnpm create @vite
```

终端敲下命令,短时间加载后需要输入项目的名称,选择 Vue 框架的 TS 版本,然后 cd 进入项目目录，安装依赖后启动项目。

就像你用 [vue-cli](https://cli.vuejs.org/) 构建的 Vue 项目一样，项目源码都被放置在`src`目录下，入口同样是`main.ts`文件。而框架的配置文件则由`vue.config.js`换成了`vite.config.ts`。此时这只是一个简单的 Vue 项目（只是把构建器从 Webpack 换成了 Vite），距离我们的目标还相去甚远。接下来我们需要安装各种 <code>[vite-plugin-\*](https://github.com/vitejs/awesome-vite#plugins)</code>，即 Vite 的插件，插件将在`vite.config.ts`中配置。

因为这是一个基于 Vite 的 Vue 项目，所以我们先把 <code>[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)</code> 配置好，该插件为 Vite 提供了 Vue3 的 SFC 支持（由于刚才生成项目的时候选择了 Vue 作为开发框架，所以该插件无需手动安装）。

```ts
// vite.config.ts
import { defineConfig } from "vite";
import ViteVue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    ViteVue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
});
```

## 文件路由

什么是文件路由？确切的说应该是**基于文件系统的路由（file system based routing）**。网站搭建后，我们只需要将平时的文章内容写在 markdown 和.vue 页面中，然后借助 vite 插件可以自动生成对应文件名的路由，而访问者只要访问具体的路由，即可访问对应文件包含的内容了，这样可以省去在 vue-router 中去针对每一篇文章写对应的路由映射表了。

这个插件就是<code>[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)</code>

```bash
# 自动生成路由的前提需要有路由功能所以需要一起安装vue-router
$ npm install vite-plugin-pages -D
# 这里推荐安装最新的vue-router 4 及以上的版本
$ npm install vue-router@4

# 配置该插件需要用到的辅助库
$ npm install @types/fs-extra @types/node fs-extra gray-matter -D
```

接下来我们来完成 vite-plugin-pages 的配置：

```ts
// vite.config.ts (以下为该插件的配置，不包括其他插件的配置)
// ...
import { resolve } from "path";
import Pages from "vite-plugin-pages";
import fs from "fs-extra";
import matter from "gray-matter";

// plugins settings
export default defineConfig({
  plugins: [
    //...
    Pages({
      extensions: ["vue", "md"],
      dirs: "pages",
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1));
        const md = fs.readFileSync(path, "utf-8");
        const { data } = matter(md);
        route.meta = Object.assign(route.meta || {}, { frontmatter: data });
        return route;
      },
    }),
  ],
});
```

- `extensions`：需要包含的文件类型，这里显然是 `.vue` 和 `.md` 文件。
- `dirs`：寻找文件的目录，这里选择了项目根目录下的 `pages` 目录。
- `extendRoute`：扩展 router 方法，可以对每个路由文件进行处理，比如对 route 的 meta 元信息进行处理。
- `front-matter`：markdown 文件顶部，由 `---` 包裹的一块区域，可以记录文章标题、作者、时间等信息：
  ```md
  ---
  title: Hello
  date: 2022-05-01
  ---
  ```
- `matter`：<code>[gray-matter](https://github.com/jonschlinkert/gray-matter)</code> 的功能，可以获取相关文件中的 `front-matter`，并将其处理为一个对象。

总结就是，vite-plugin-pages 会自动把 `pages` 目录中的 `.vue` 和 `.md` 文件生成对应的路由，并且我们可以利用 markdown 的 `front-matter` 来为路由提供一些额外信息。

然后我们来修改一下项目中的一些文件，让它们的功能和结构符合当前的插件配置。

为了让路由在 app 中生效，我们需要创建一个`router`，并让 app use 。在 src 目录下新建一个 router 专门用来管理路由,在 router 文件夹中创建 index.ts 用作入口文件：

先来配置路由的基本信息

```bash
# 这里可以一起先安装一下nprogress,这个可以让我们页面在路由跳转时在顶部显示进度条。
$ npm install nprogress
$ npm install @types/nprogress -D
```

```ts
// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NProgress from "nprogress";
// 将自动生成页面的路由导入
import generaterRoutes from "pages-generated";

const routes: RouteRecordRaw[] = [];
// 将当前目录中所有二点module下的所有配置的路由映射表导入
const modules = import.meta.globEager("./module/*.ts");
for (const path in modules) {
  routes.push(...modules[path].default);
}

// 在添加完配置好的路由表后,再将vite自动生成的page下的页面路由加入到routes中
routes.push(...generaterRoutes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//  在全局的路由的钩子中将进度条动画显示
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
```

```ts
//  src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
createApp(App)
  .use(router)
  .mount("#app");
```

<blockquote>
Note: 在 TS 中，直接从 `pages-generated` 导入会引起类型错误，需要在 `tsconfig.json` 的 `compilerOptions.types` 数组中加入 `vite-plugin-pages/client` 来加载对应的声明文件。
</blockquote>

`App.vue` 文件也需要进行修改，我们可以删除自动生成的所有代码，然后添加一个简单:

```html
<!-- src/App.vue -->
<template>
  <router-view />
</template>
```

我们在项目根目录下创建 `pages` 文件夹，并在里面创建一个 `index.vue` 文件作为 homepage，再创建一个 `foo.vue` 作为测试页面：

```html
<!-- pages/index.vue -->
<template>
  <div>Hello, pages</div>
</template>

<!-- pages/foo.vue -->
<template>
  <div>foo</div>
</template>
```

上面的这些操作其实就和我们构建一个常规的 Vue 项目一样。现在我们可以运行一下网站：

```bash
$ npm run dev
```

你可以在浏览器中看到我们设置的首页。在地址栏中添加 `/foo` 可以跳转到 foo 页面。

## 支持 Markdown

完成上面的 vite-plugin-pages 插件配置后，也许你尝试在 `pages` 目录下创建一个 `.md` 文件的页面，但是却发现尽管路由生成了，但是页面却无法显示，因为目前这个静态网站生成器还缺少 markdown 的支持。

<code>[vite-plugin-md](https://github.com/antfu/vite-plugin-md)</code> 为 Vite 提供了将 markdown 当作 Vue 组件使用的功能，也可以在 markdown 中使用 Vue 组件。安装该插件：

```bash
$ npm i vite-plugin-md -D
```

然后配置一下:

```ts
// vite.config.ts (以下为该插件的配置，不包括其他插件的配置)
// ...
import Markdown from "vite-plugin-md";

// plugins settings
export default defineConfig({
  plugins: [
    //...
    ViteMarkdown(),
  ],
});
```

现在我们就可以在 `pages` 目录下创建一个 `bar.md` 来尝试一下了：

```md
<!-- pages/bar.md -->

# Hi, Markdown

This is a markdown page.
```

重启项目后，在浏览器地址栏里添加 `/bar`，就可以看到这个 markdown 页面了。

不是说还可以在 markdown 文件中使用 Vue 组件吗？那么现在，在`src/components` 下建立一个 Vue 组件，比如叫 `MyComponent.vue`：

```html
<!-- src/components/MyComponent.vue -->
<template>
  <div>This is a Vue component.</div>
</template>
```

然后我们把该组件加入到 `pages/bar.md` 中:

```diff
<!-- pages/bar.md -->

# Hi, Markdown

This is a markdown page.

+ <MyComponent />
```

重启项目，什么都没有发生 😅。这是因为 markdown 中我们没法像 js/ts 那样将组件 import 进来，所以除非这个组件被全局注册，否则无法直接使用。

这里又有一个 <code>[unplugin-vue-components/vite](https://github.com/antfu/unplugin-vue-components)</code> 插件可以帮我们解决问题，这个插件提供了组件自动导入功能（ vite-plugin-md 实际上是对 markdown 进行了 html 转换处理，所以在 markdown 中使用了组件，也可以获得 unplugin-vue-components/vite 的支持）。配置一下插件：

```bash
//自动引入组件
npm install unplugin-vue-components/vite -D
//自动引入图标
npm install unplugin-icons -D
```

```ts
// vite.config.ts (以下为该插件的配置，不包括其他插件的配置)
// ...
import Components from "unplugin-vue-components/vite";

// plugins settings
export default defineConfig({
  plugins: [
    //...
    Components({
      extensions: ["vue", "md"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: "",
        }),
      ],
    }),
  ],
});
```

重启项目，此时 `MyComponent` 组件已经正确的显示了！
