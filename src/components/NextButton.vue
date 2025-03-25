<script setup lang="ts">
import { useArrowStyle } from '../composable/arrowStyle'
import arrowImage from '@/assets/arrow-point-to-right.png'

const emit = defineEmits(['click-next-button'])

// define style
const { buttonWrapperStyle, buttonStyle, onMouseUpButton } = useArrowStyle()

/**
 * click prev button event
 */
const clickNext = () => {
  emit('click-next-button')
}
</script>
<template>
  <div :style="buttonWrapperStyle">
    <button
      class="next-button"
      :style="buttonStyle"
      @click="clickNext"
      @mouseup="onMouseUpButton"
      aria-label="Next slide"
    >
      <img
        alt="left arrow"
        :src="arrowImage"
        :style="{
          width: '10px',
          borderRadius: '3px'
        }"
      />
    </button>
  </div>
</template>
