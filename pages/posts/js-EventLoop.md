---
title: EventLoop 与 nextTick
date: 2022-11-27T20:30:00.000+00:00
tags: ["JS"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## JS 执行机制

学 js 的时候都知道 js 是单线程的,因为如果是多线程的话如果同时操作 Dom 就会引发一系列问题,例如:在同一时间内同时操作 DOM ,一个增加一个删除,那么 JS 就不知道需要听哪个的操作了，所以这个语言是单线程的。而随着 HTML5 到来 js 也支持了多线程 webWorker 但是也是不允许操作 DOM。
<br/>
单线程就意味着所有的任务都需要排队,等待依次执行，如果前面的任务耗时比较久,那么后面的任务需要等前面的任务执行完才能执行，后面的任务就需要一直等，这样在某种程度上会让一些从用户角度上不需要等待的任务就会一直等待，这个从体验角度上来讲是不可接受的，所以 JS 中就出现了异步的概念。
<br/>

## 同步任务

代码依次从上至下按照顺序执行

## 异步任务

### 1.宏任务

script(代码块)、setTimeout、setInterval、UI 交互事件、postMessage、Ajax 等

### 2.微任务

Promise.then\catch\finally、MutaionObserver、process.nextTick(Node.js 环境)

## 3.运行机制

所有的同步任务都是在主进程执行的,并且形成一个执行栈，主线程之外，还存在一个"任务队列"，所有的异步任务会依次的放入这个执行队列中并且依次执行。

1. _解析 script 本身就是一个宏任务_:首先在执行一个新的 script 代码块时,这个已经是宏任务了。
2. _执行所有同步代码_:此时如果遇到同步代码则会立即执行。
3. _将对应任务放入到对应的任务队列中_:遇到宏任务或者微任务时,则会将该任务放入到对应的宏任务或微任务的队列当中。
4. _执行微任务队列中的微任务_:等到所有的任务都已经放入对应队列后,这时该解析 script 的宏任务就已经结束,所以现在会将所有的微任务队列当中的任务按照先进先出的顺序进行执行。
5. _浏览器执行渲染操作_:直到微任务队列中所有的微任务执行完毕之后这时浏览器会先进行dom的更新渲染。
6. _进行执行宏任务队列当中的任务_:这时会把所有宏任务队列当中的宏任务按照先进先出的顺序进行执行,如果在宏任务执行时产生了微任务,则会优先将微任务队列当中的微任务执行完毕后再去执行下一个宏任务。
### 即: 每个宏任务中产生的微任务会在执行下一个宏任务前,清空执行微任务队列中所有的微任务。在执行微任务时,如果产生宏任务,则会先将宏任务放入到宏任务队列当中,等到当前微任务队列中所有的微任务执行完毕才会去宏任务中依次执行。在执行宏任务时就会回到开头说的依次循环。
`为何有alert的页面时,setTimeout不会先进行计时,这是因为alert会阻塞浏览器的渲染,并且setTimeout是宏任务,会在浏览器首次渲染之后才会执行调用。`
