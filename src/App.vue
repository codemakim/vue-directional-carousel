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
  <div style="display: flex; justify-content: center">
    <DirectionalCarousel
      :items="items"
      :direction="'right'"
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
