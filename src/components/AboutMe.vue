<script setup lang="ts">
import typedjs from 'typed.js'
import { ref, watch } from 'vue'
import type { Introduce } from "@/utils/aboutMe";
import { myIntroduce } from "@/utils/aboutMe";
import {unrefElement} from "@vueuse/core"

const inputRef = ref()
let typed: typedjs | undefined
const showReplay = ref(false);


function formatWords(item:Introduce){
    let words = []
    for(let i = 0; i< item.keyword.length; i++){
        words.push({
            words: item.words,
            keyword: item.keyword[i],
            color: item.color[i],
            weight: item.weight
        })
    }
    return words
}

const replay = ()=>{
    showReplay.value = false;
    typed?.reset();
}

watch(
    inputRef,
    () => {
        const el = unrefElement(inputRef);

        if (!el) return;

        typed = new typedjs(el, {
            strings: myIntroduce
                .map((e) => e.words)
                .concat("I'm xxGw, Welcome to my website."),
            typeSpeed: 20,
            onStringTyped: (index) => {
                if (index == myIntroduce.length) {
                    let data: any[] = [];
                    myIntroduce.forEach((e) => {
                        data.push(...formatWords(e));
                    });
                    showReplay.value = true;
                }
            },
        });
    },
    {
        flush: "post",
    }
);
</script>

<template>
  <div text-center h-100 pt-50>
    <span ref="inputRef" text-lg></span>
    <button v-if="showReplay" @click="replay"  class="icon-btn">
        <mdi-replay style="display: inline; vertical-align: text-top" />
    </button>
  </div>
</template>
