<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import VerticalCarousel from './components/VerticalCarousel.vue';
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
  <div style="color: 'white';"
  >
    <VerticalCarousel
      :items="[
        { title: 'item 1', url: 'naver.com' },
        { title: 'item 2', url: 'naver.com' },
        { title: 'item 3', url: 'naver.com' },
        { title: 'item 4', url: 'naver.com' },
        { title: 'item 5', url: 'naver.com' },
        { title: 'item 6', url: 'naver.com' },
        { title: 'item 7', url: 'naver.com' },
        { title: 'item 8', url: 'naver.com' },
        { title: 'item 9', url: 'naver.com' },
        { title: 'item 10', url: 'naver.com' },
        { title: 'item 11', url: 'naver.com' },
      ]"
      :show-prev="false"
      :show-next="false"
    >
    <template #item="item">
      <div :style="{ backgroundColor: 'white', color: 'black' }">
        {{ item.title }} / {{ item.url }}
      </div>
    </template>
    </VerticalCarousel>
</div>
  
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
