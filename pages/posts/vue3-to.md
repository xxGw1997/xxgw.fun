---
title: Vue3 to[...] 系列
date: 2022-06-12T20:30:00.000+00:00
tags: ["Vue3", "to[...]"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## toRef toRefs toRaw

### toRef

将 reactive 对象的某个 key 变成 ref 对象
如果原始对象是非响应式的就不会更新视图 数据会改变

```js
<template>
   <div>
      <button @click="change">按钮</button>
      {{state}}
   </div>
</template>

<script setup lang="ts">
import { reactive, toRef } from 'vue'

const obj = {
   foo: 1,
   bar: 1
}


const state = toRef(obj, 'bar')
// bar 转化为响应式对象

const change = () => {
   state.value++
   console.log(obj, state);
}
</script>
// 如果原始对象是响应式的是会更新视图并且改变数据的
```

### toRefs

可以帮我们批量创建 ref 对象主要是方便reactive对象的解构。
源码内部实现其实就是循环对象中每个属性。然后调用 toRef 方法

```js
import { reactive, toRefs } from "vue";
const obj = reactive({
  foo: 1,
  bar: 1,
});
let { foo, bar } = toRefs(obj);
foo.value++;
console.log(foo, bar);
```

### toRaw

将响应式对象转化为普通对象

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

### toRef(源码实现)

如果是 ref 对象直接返回 否则 调用 ObjectRefImpl 创建一个类 ref 对象

```js
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K]
): ToRef<T[K]> {
  const val = object[key]
  return isRef(val)
    ? val
    : (new ObjectRefImpl(object, key, defaultValue) as any)
}
```

类 ref 对象只是做了值的改变 并未处理 收集依赖 和 触发依赖的过程 所以 普通对象无法更新视图

```js
class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(
    private readonly _object: T,
    private readonly _key: K,
    private readonly _defaultValue?: T[K]
  ) {}

  get value() {
    const val = this._object[this._key]
    return val === undefined ? (this._defaultValue as T[K]) : val
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}
```

### toRefs(源码实现)

其实就是把 reactive 对象的每一个属性都变成了 ref 对象循环 调用了 toRef

```js
export type ToRefs<T = any> = {
  [K in keyof T]: ToRef<T[K]>
}
export function toRefs<T extends object>(object: T): ToRefs<T> {
  if (__DEV__ && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
```

### toRaw(源码实现)

通过 ReactiveFlags 枚举值 取出 proxy 对象的 原始对象

```js
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}

export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}
```
