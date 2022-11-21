<script setup lang="ts">
import { isDark } from "@/utils";
</script>
<template>
  <header class="header z-40">
    <router-link
      w-25
      h-25
      absolute
      lg:fixed
      m-6
      select-none
      outline-none
      to="/"
      focusable="false"
    >
      <img w-25 h-25 v-show="isDark" src="@/assets/ywx-dark.png" alt="logo" />
      <img w-25 h-25 v-show="!isDark" src="@/assets/ywx.png" alt="logo" />
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/posts">
          <span lt-md:hidden fc>Blog</span>
          <div i-ri-article-line md:hidden />
        </router-link>
        <!-- <router-link to="/life" lt-md:hidden>
          Life
        </router-link> -->
        <a
          href="https://github.com/xxgw1997"
          target="_blank"
          title="GitHub"
          lt-md:hidden
        >
          <div i-uil-github-alt />
        </a>
        <toggle-theme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
