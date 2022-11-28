---
title: Vue3 Reactive 源码笔记(响应式原理)
date: 2022-06-10T10:30:00.000+00:00
tags: ["Vue3", "Vue", "Reactive"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## 命令式的响应式原理

响应式的数据就需要具备,能够随着自己依赖的值的变化而发生变化,用命令式实现就是

```js
let a = 1;
let b = a + 1; //b的值比a的值大1
//如果这时将a进行更新
a = 2;
//b如果也要保持比a的值大1,则我们需要重新进行赋值
b = a + 1;
```

再优化一下

```js
let a = 1;
let b;
function updateB() {
  b = a + 1;
}
a = 2;
updateB();
/*
    但是我们还是要多做一步更新的操作,这样不是我们所想要的响应式,
    那要如何才能在更新a的时候,让更新操作自动去执行呢
*/
```

## 自动式的响应式原理

首先我们需要将 b 所依赖的数据给收集保存起来
然后在 a 进行更新时,再将更新操作自动去执行

- 这里就需要用到 es2015 新增的 proxy 代理去实现,
- proxy 可以传入两个参数,第一个是需要代理的对象,
- 第二个是一个对象,需要有 get(){}和 set(){}两个自定义方法,
- 这两个方法分别会读取该对象的值和更新该对象的值的时候去触发

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver);
    },
  });
}
let a = reactive({ age: 1 });
a.age; //访问a对象中的age属性时,get 函数执行
a.age = 2; //更新a对象中的age属性时, set 函数执行
```

这个有了 proxy 提供的 get 函数和 set 函数我们就可以进行依赖的收集和到时候属性发生改变时对应的更新操作了

```js
let activeEffect = null;
let effects = [];
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      //收集需要触发的函数
      effects.push(activeEffect);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      //将之前收集的函数执行更新
      effects.forEach((effect) => effect());
      return res;
    },
  });
}
let a = reactive({ age: 1 });
let b = 2;
function effect(fn) {
  activeEffect = fn;
  return fn();
}
effect(() => {
  b = a.age + 1;
});
console.log(b); // 2
a.age = 2; //执行更新会自动调用set方法,set方法中会将之前收集到的函数执行
console.log(b); // 3
```

这就是响应式基本的原理,但是这样还是有很多漏洞,比如收集的 effect 可能有多个,并且这些 effect 都是同一个函数,这样就会造成重复执行.以及很多边界情况的判定,并且每个模块最好可以抽离开来,所以需要进行优化.

## 优化后的响应式模块

```js
// reactive.js
export const mutableHandlers = {
    get(target,key,receiver){
        const res = Reflect.get(target,key,receiver)
        return res
    },
    set(target,key,value,receiver){
        const res = Reflect.set(target,key,value,receiver)
        return res
    }
}

const targetMap = new WeakMap()
export function track(target,key){
    if(!activeEffect) return
    let depsMap = targetMap.get(target)
    if(!depsMap) targetMap.set(target,(depsMap = new Map()))
    let dep = depsMap.get(key)
    if(!dep) depsMap.set(key,(dep = new Set()))
    dep.add(activeEffect)
    activeEffect.deps.push(dep) //双向绑定
}

export function trigger(target,key){
    const depsMap = targetMap.get(target)
    if(!depsMap) return
    let effects = depsMap.get(key)
    effects = new Set(effects)  //拷贝一份
    effects.forEach(effect=>{
        //防止循环更新
        if(effect !== activeEffect){
            //触发更新,如果用户传入的自定义的调度函数则就调用用户传入的
            if(effect.scheduler){
                effect.scheduler()
            }else{
            //否则就调用用户的依赖收集的逻辑
                effect.run()
            }
        }
    })
}

const reactiveMap = new WeakMap()   //用于存放响应式数据的Map,以便后续重新创建
export function createReactivityObject(target,baseHandlers){
    let proxy = reactiveMap.get(target)
    if(!proxy){
        proxy = new Proxy(target,baseHandlers)
        reactiveMap.set(target,proxy)
    }
    return proxy
}

let activeEffect = null
class ReactiveEffect{
    public deps = []
    constructor(public fn,public scheduler){}
    run(){
        try {
            activeEffect = this
            return this.fn()
        } finally {
            activeEffect = null
        }
    }
}

export function effect(fn,scheduler={}){
    const _effect = new ReactiveEffect(fn,scheduler)
    _effect.run()
}

export function reactive(target){
    return createReactivityObject(target,mutableHandlers)
}
```

这样一个相对完整的响应式模块就完成了,用户可以调用将需要响应式化的数据放在 reactive 中,然后再将需要更新的逻辑放在 effect 中
