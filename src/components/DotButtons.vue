<script setup lang="ts">
import { type Ref, type CSSProperties, ref, computed } from 'vue'
import { type DotButtonsProps } from '../types/props'

const emit = defineEmits(['click-dot-button'])

const props = withDefaults(defineProps<DotButtonsProps>(), {
  currentIndex: 0,
  itemCount: 0,
  showDots: false
})

const style: Ref<CSSProperties> = ref({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap'
})

/**
 * click dot button
 * @param {number} sequence clicked buton sequence
 */
const clickDot = (sequence: number) => {
  emit('click-dot-button', sequence - 1)
}

// dot 버튼 스타일 - 현제 화면에 표시되는 이미지의 인덱스에 따라 스타일 강조
const dotStyles = computed(() =>
  new Array(props.itemCount)
    .fill({
      border: 'none',
      borderRadius: '50%',
      backgroundColor: 'gray',
      cursor: 'pointer'
    })
    .map((el, index) => {
      const isCurrent = index === (props.itemCount > props.currentIndex ? props.currentIndex : 0)
      return {
        ...el,
        opacity: isCurrent ? '1' : '0.5',
        height: isCurrent ? '8px' : '6px',
        paddingInline: isCurrent ? '4px' : '3px'
      }
    })
)
</script>
<template>
  <div v-if="showDots" :style="style">
    <div
      v-for="seq in itemCount"
      :style="{
        padding: '0px 4px 0px 4px'
      }"
    >
      <button :style="dotStyles[seq - 1]" @click="clickDot(seq)" />
    </div>
  </div>
</template>
