---
title: Vue3 Reactive 全家桶
date: 2022-06-15T20:00:00.000+00:00
tags: ["Vue3", "Vue", "Reactive"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## reactive

用来绑定复杂的数据类型 例如 对象、数组。
不可以绑定普通的数据类型。否则会报错。
绑定普通的数据类型，可以使用之前讲到的 ref。
如果用 ref 去绑定对象 或者 数组 等复杂的数据类型。源码里面其实也是 去调用 reactive
使用 reactive 去修改值无须.value

```js
import { reactive } from "vue";
let person = reactive({
  name: "xxgw",
});
person.name = "xxGw";
```

数组异步赋值问题
这样赋值页面是不会变化的因为会脱离响应式

```js
let person = reactive<number[]>([])
setTimeout(() => {
  person = [11,22,33]
  console.log(person);
},1000)
```

解决方案 1: 数组展开运算符 push

```js
import { reactive } from 'vue'
let person = reactive<number[]>([])
setTimeout(() => {
  const arr = [11, 22, 33]
  person.push(...arr)
  console.log(person);

},1000)
```

解决方案 2: 包裹一层对象

```js
type Person = {
  list?: Array<number>,
};
let person =
  reactive <
  Person >
  {
    list: [],
  };
setTimeout(() => {
  const arr = [11, 22, 33];
  person.list = arr;
  console.log(person);
}, 1000);
```

## readonly

拷贝一份 proxy 对象将其设置为只读

```js
import { reactive, readonly } from "vue";
const person = reactive({ count: 1 });
const copy = readonly(person);
copy.count++; //报错,不会改变
```

## shallowReactive

只能对浅层的数据 如果是深层的数据只会改变值 不会触发视图的更新

```js
<template>
  <div>
    <div>{{ state }}</div>
    <button @click="change1">test1</button>
    <button @click="change2">test2</button>
  </div>
</template>

<script setup lang="ts">
import { shallowReactive } from 'vue'
const obj = {
  a: 1,
  first: {
    b: 2,
    second: {
      c: 3
    }
  }
}

const state = shallowReactive(obj)

function change1() {
  state.a = 7   //视图也会更新
}
function change2() {
  state.first.b = 8   //视图不更新
  state.first.second.c = 9  //视图不更新
  console.log(state);   //数据更新
}
</script>
```
