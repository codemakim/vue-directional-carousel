<script setup lang="ts">
import { useArrowStyle } from '../composable/arrowStyle'

const emit = defineEmits(['click-prev-button'])

// define style
const { buttonWrapperStyle, buttonStyle, onMouseDownButton } = useArrowStyle()

/**
 * click prev button event
 */
const clickPrev = () => {
  emit('click-prev-button')
}
</script>
<template>
  <div :style="buttonWrapperStyle">
    <button
      class="prev-button"
      :style="buttonStyle"
      @click="clickPrev"
      @mousedown="onMouseDownButton"
    >
      <img
        alt="left arrow"
        :src="'src/assets/arrow-point-to-right.png'"
        :style="{
          width: '10px',
          borderRadius: '50%',
          transform: 'scaleX(-1)'
        }"
      />
    </button>
  </div>
</template>
