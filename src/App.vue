<script setup lang="ts">
import VerticalCarousel from './components/VerticalCarousel.vue'
</script>

<template>
  <div style="margin: auto">
    <VerticalCarousel
      :items="[
        { src: 'item 1' },
        { src: 'item 2' },
        { src: 'item 3' },
        { src: 'item 4' },
        { src: 'item 5' },
        { src: 'item 6' },
        { src: 'item 7' },
        { src: 'item 8' },
        { src: 'item 9' },
        { src: 'item 10' },
        { src: 'item 11' }
      ]"
      :show-prev="false"
      :show-next="false"
      :style="{
        margin: 'auto'
      }"
    >
      <template #item="item">
        <div
          :style="{
            backgroundColor: 'white',
            color: 'black',
            border: 'black solid 1px'
          }"
        >
          {{ item.title }} / {{ item.url }}
        </div>
      </template>
    </VerticalCarousel>
  </div>
</template>
