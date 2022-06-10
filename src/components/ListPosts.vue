<script setup lang="ts">
import { useRouter } from "vue-router";
import { formatDate } from "@/utils";
import { computed } from "vue";

export interface Post {
  path: string;
  title: string;
  date: string;
  lang?: string;
  duration?: string;
}

const props = defineProps<{
  type?: string;
  posts?: Post[];
}>();

const getFrontmatter = (route: any) => {
  return route.meta.frontmatter as any;
};

const router = useRouter();
const routes: Post[] = router
  .getRoutes()
  .filter((i) => i.path.startsWith("/post") && getFrontmatter(i).date)
  .sort(
    (a, b) =>
      +new Date(getFrontmatter(b).date) - +new Date(getFrontmatter(a).date)
  )
  .filter(
    (i) => !i.path.endsWith(".html") && getFrontmatter(i).type === props.type
  )
  .map((i) => ({
    path: i.path,
    title: getFrontmatter(i).title,
    date: getFrontmatter(i).date,
    lang: getFrontmatter(i).lang,
    duration: getFrontmatter(i).duration,
  }));

const posts = computed(() => props.posts || routes);
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        nothing here yet
      </div>
    </template>
    <router-link
      v-for="route in posts"
      :key="route.path"
      class="item block font-normal mb-6 mt-2 no-underline"
      :to="route.path"
    >
      <li no-underline>
        <div class="title" text-lg>
          {{ route.title }}
        </div>
        <div class="time op50 text-sm -mt-1">
          {{ formatDate(route.date) }}
          <span v-if="route.duration" op-50>{{ route.duration }}</span>
        </div>
      </li>
    </router-link>
  </ul>
</template>
