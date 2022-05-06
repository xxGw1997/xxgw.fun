<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { useHead } from "@vueuse/head";
useHead({
  meta: [
    { property: "og:title", content: "xxGw" },
    { name: "description", content: "Archer Gu's Room" },
  ],
});
</script>

<template>
  <NavBar />
  <main px-7 py-10>
    <router-view />
    <Footer />
  </main>
</template>
