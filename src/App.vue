<script setup lang="ts">
import { ref } from 'vue'
import DirectionalCarousel from './components/DirectionalCarousel.vue'
const items = ref([
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
])
</script>

<template>
  <div style="margin: auto">
    <DirectionalCarousel :items="items" :direction="'left'">
      <template #item="item">
        <div
          :style="{
            backgroundColor: 'white',
            color: 'black',
            border: 'black solid 1px'
          }"
        >
          {{ item.src }}
        </div>
      </template>
    </DirectionalCarousel>
  </div>
</template>
