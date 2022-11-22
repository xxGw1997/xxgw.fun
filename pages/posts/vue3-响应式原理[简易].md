---
title: Vue3 响应式原理[简易版]
date: 2022-06-13T20:30:00.000+00:00
tags: ["Vue3", "响应式原理"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## 响应式原理

Vue2 是通过 Object.defineProperty 做数据的劫持。
Vue3 是通过 Proxy 对对象进行代理。

## Vue2 defineProperty 的不足

对象只能劫持 设置好的数据，新增的数据需要 Vue.Set(xxx)。
并且数组只能操作七种方法，修改某一项值无法劫持。

## Vue3 Proxy 的优点

Vue3 的响应式原理依赖了 Proxy 这个核心 API，通过 Proxy 可以劫持对象的某些操作。

## reactive 和 effect 的实现

```js
export const reactive = (target) => {
  return new Proxy(target, {
    get(target, key, receiver) {
      let res = Reflect.get(target, key, receiver);
      return res;
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      return res;
    },
  });
};
```

## effect

```js
// 使用一个全局变量 activeEffect 收集当前副作用函数，并且初始化的时候调用一下
let activeEffect;
//实现effect 副作用函数
export const effect = (fn) => {
  const _effect = () => {
    activeEffect = _effect;
    fn();
  };

  _effect();
};
```

## track trigger

- track 和 trigger 主要就是对 targetMap 来进行操作
- track 是将对象、key、副作用函数 effect 拼凑成一个 targetMap 的数据结构
- trigger 是根据 target、key 在 targetMap 中 取到对应的副作用函数进行执行
- targetMap 大致结构

```js
targetMap: {
  obj1: {
    // 这是一个Map
    key1: [effect1,effect2,effect3 ...] //这是一个set
    key2: [effect11,effect22,effect33 ...] //这是一个set
  },
  obj2: {
    // 这是一个Map
    key1: [effect1,effect2,effect3 ...] //这是一个set
    key2: [effect11,effect22,effect33 ...] //这是一个set
  }
}
```

- track trigger

```js
const targetMap = new WeakMap();
export const track = (target, key) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  console.log(activeEffect);
  deps.add(activeEffect);
};

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  deps.forEach((effect) => effect());
};
```

- 被 effect 函数包裹的副作用函数会先调用一次,调用时会访问对应对象的属性时会触发 proxy 的 get 方法
- 这时会出发 track 依赖收集，将对象和对象的属性和 effect 方法绑定起来
- 之后在修改对象中某个属性的值时会出发对应的属性 set 方法，然后再进行触发更新，即自动执行副作用函数

```js
import { track, trigger } from "./effect.js";

export const reactive = (target) => {
  return new Proxy(target, {
    get(target, key, receiver) {
      let res = Reflect.get(target, key, receiver);
      track(target, key);
      return res;
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return res;
    },
  });
};
```

测试 demo

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">

    </div>
    <script type="module">
        import { reactive } from './reactive.js'
        import { effect } from './effect.js'
        const user = reactive({
            name: 'xxgw',
            age: 20
        })

        effect(() => {
            document.querySelector('#app').innerHTML = `姓名:${user.name},年龄:${user.age}`
        })

        //两秒后视图自动更新
        setTimeout(() => {
            user.name = 'xxGw'
        }, 2000);

    </script>
</body>

</html>
```
