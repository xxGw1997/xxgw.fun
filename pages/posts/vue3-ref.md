---
title: Vue3 Ref 全家桶
date: 2022-06-12T20:30:00.000+00:00
tags: ["Vue3", "Ref"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## ref

接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 .value 属性，指向该内部值。

```js
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>



<script setup lang="ts">
let message: string = "我是message"

const changeMsg = () => {
   message = "change msg"
}
</script>

// 我们这样操作是无法改变message  的值,
// 因为message 不是响应式的无法被vue 跟踪所以要引入ref
```

## isRef(判断是不是一个 ref 对象)

```js
import { ref, Ref, isRef } from "vue";
let message: Ref<string | number> = ref("我是message");
let notRef: number = 123;
const changeMsg = () => {
  message.value = "change msg";
  console.log(isRef(message)); //true
  console.log(isRef(notRef)); //false
};
```

## shallowRef

创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的

例 1:修改其属性是非响应式的这样是不会改变的

```js
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { Ref, shallowRef } from 'vue'
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: "xxgw"
})

const changeMsg = () => {
  message.value.name = 'xxGw'
}
</script>
```

例 2:这样是可以被监听到的修改 value

```js
import { Ref, shallowRef } from "vue";
type Obj = {
  name: string,
};
let message: Ref<Obj> = shallowRef({
  name: "xxgw",
});

const changeMsg = () => {
  message.value = { name: "xxGw" };
};
```

## triggerRef

强制更新页面 DOM,可以强制改变值

```js
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { Ref, shallowRef,triggerRef } from 'vue'
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: "xxgw"
})

const changeMsg = () => {
  message.value.name = 'xxGw'
 triggerRef(message)
}
</script>
```
