---
title: Vue3 v-model
date: 2022-06-12T20:30:00.000+00:00
tags: ["Vue3", "Vue", "v-model"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## v-model

v-model 本质是一个语法糖 通过 props 和 emit 组合而实现

- 1.默认值的改变
  - prop：value -> modelValue；
  - 事件：input -> update:modelValue；
  - v-bind 的 .sync 修饰符和组件的 model 选项已移除
  - 新增 支持多个 v-model
  - 新增 支持自定义 修饰符 Modifiers

### v-mode 的实现 父子组件的通信

Main.vue

```js
<template>
  <div>
    <div>Main - flag - {{ flag }}</div>
    <button @click="flag = !flag">修改 flag</button>
    <Dialog v-model="flag" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let flag = ref<Boolean>(true)
import Dialog from './childCom/Dialog.vue'
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>
```

Dialog.vue

```js<template>
  <div v-if="modelValue" class="dialog">
    <div class="dialog-header">
      <span>标题</span>
      <button @click="close">关闭</button>
    </div>
    <div class="dialog-main">
      {{ modelValue }}
    </div>
  </div>
</template>
<script setup lang="ts">
type Props = {
  modelValue: Boolean
}
defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
const close = () => {
  emit('update:modelValue', false)
}
</script>
<script lang="ts">
export default {
  name: 'Dialog',
}
</script>
<style lang="scss" scoped>
.dialog {
  width: 400px;
  height: 250px;
  border: 1px solid #ccc;
  &-header {
    height: 40px;
    border: 1px solid #ccc;
  }
  &-body {
    height: 210px;
  }
}
</style>
```

- 效果
  - 父组件之中，点击 修改 flag 的时候，可以控制 dialog 组件的显示和隐藏
  - 子组件 dialog 之中 点击关闭的时候，可以修改父组件的 flag 的值

### v-model 自定义修饰符

main.vue

```js
<template>
  <div>
    <div>Main - 标志 - {{ flag }} 标题 - {{ title }}</div>
    <button @click="flag = !flag">修改 flag</button>
    <!-- 添加xxgw -->
    <!-- <Dialog v-model.xxgw="flag" v-model:title="title" /> 修饰符 -->
    <!-- 没有添加 xxgw修饰符 -->
    <Dialog v-model="flag" v-model:title="title" />
    <B />
    <C />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let flag = ref<Boolean>(true)
import Dialog from './childCom/Dialog.vue'
import B from './childCom/B.vue'
import C from './childCom/C.vue'
let title = ref<String>('xxgw')
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>
<style lang="scss" scoped></style>
```

dialog.vue

```js
<template>
  <div v-if="modelValue" class="dialog">
    <div class="dialog-header">
      <span>标题 - {{ title }}</span>
      <button @click="close">关闭</button>
    </div>
    <div class="dialog-main">
      <button @click="changTitle">修改 标题</button>
      {{ modelValue }}
    </div>
  </div>
</template>
<script setup lang="ts">
type Props = {
  modelValue: Boolean
  title: String
  modelModifiers?: {
    // default: () => {}
    xxgw: Boolean
  }
}
const propsData = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'update:title'])
const close = () => {
  emit('update:modelValue', false)
}
const changTitle = () => {
  if (propsData.modelModifiers?.xxgw) {
    //添加自定义修饰符返回 'i am xxgw'
    emit('update:title', 'i am xxgw')
  } else {
    //没有添加自定义修饰符返回 'i am xxGw'
    emit('update:title', 'i am xxGw')
  }
}
</script>
<script lang="ts">
export default {
  name: 'Dialog',
}
</script>
<style lang="scss" scoped>
.dialog {
  width: 400px;
  height: 250px;
  border: 1px solid #ccc;
  &-header {
    height: 40px;
    border: 1px solid #ccc;
  }
  &-body {
    height: 210px;
  }
}
</style>


```
