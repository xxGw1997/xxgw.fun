<script setup lang="ts">
import { useRoute } from "vue-router";
import { vueOnly } from "../utils";

const inactiveStyle = "opacity-20 hover:opacity-50";

const route = useRoute();
</script>

<template>
  <div class="prose m-auto mb-8 select-none">
    <div mb-0 flex="~ gap-3" text-3xl>
      <router-link
        to="/posts"
        class="!border-none !font-400"
        :class="route.path === '/posts' ? '' : inactiveStyle"
      >
        Blog
      </router-link>
      <!-- <router-link to="/streams" class="!border-none !font-400" :class="route.path === '/streams' ? '' : inactiveStyle">
        Streams
      </router-link> -->
    </div>
    <button
      flex="~ gap1"
      items-center
      mb2
      op30
      text-xs
      @click="vueOnly = !vueOnly"
    >
      <div :i="vueOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'" />
      Vue
    </button>
  </div>
</template>
