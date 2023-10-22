<script setup lang="ts">
import { useArrowStyle } from '../composable/arrowStyle'

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
    <button class="next-button" :style="buttonStyle" @click="clickNext" @mouseup="onMouseUpButton">
      <img
        alt="left arrow"
        :src="'src/assets/arrow-point-to-right.png'"
        :style="{
          width: '10px',
          borderRadius: '3px'
        }"
      />
    </button>
  </div>
</template>
../composable/arrowStyle
