<script setup lang="ts">
import { ref } from 'vue'
import DirectionalCarousel from './components/DirectionalCarousel.vue'
const items = ref([
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg',
  'src/assets/sampleImage/carousel_image.jpg'
])
</script>

<template>
  <div style="margin: 0 auto">
    <DirectionalCarousel
      :items="items"
      :direction="'down'"
      :width="'50%'"
      :height="'200px'"
      :show-prev="true"
      :show-next="true"
      :show-dots="true"
      :interval="2000"
    >
    </DirectionalCarousel>
  </div>
</template>
