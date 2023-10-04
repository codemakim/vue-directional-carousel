<script setup lang="ts">
import { ref } from 'vue'
import DirectionalCarousel from './components/DirectionalCarousel.vue'
const items = ref([
  'item 1',
  'item 2',
  'item 3',
  'item 4',
  'item 5',
  'item 6',
  'item 7',
  'item 8',
  'item 9',
  'item 10',
  'item 11'
])
</script>

<template>
  <div style="margin: auto">
    <DirectionalCarousel :items="items" :direction="'down'" :width="'600px'" :height="'200px'">
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
