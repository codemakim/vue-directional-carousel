<!-- eslint-disable vue/no-setup-props-destructure -->

<script setup lang="ts">
import { type VerticalCarouselProps } from '../types/props'
import {
  type Ref,
  type ComputedRef,
  type CSSProperties,
  ref,
  computed,
} from 'vue'
import DotButtons from '@/components/DotButtons.vue'
import PrevButton from './PrevButton.vue'
import NextButton from './NextButton.vue'
import useRenderTransition from '@/composable/renderTransition'
import useCarouselEvent from '@/composable/carouselEvent'

const props = withDefaults(defineProps<VerticalCarouselProps>(), {
  width: '100%',
  height: '300px',
  direction: 'right',
  duration: 1000,
  showPrev: true,
  showNext: true,
  showDots: true,
  interval: 0,
  pauseAutoplayOnHover: false
})

// width of carousel area
const carouselContainer: Ref<HTMLElement | null> = ref(null)

// In the case where items is of type string[],
// it is transformed into the format { src: string }[]
const computedItems = computed(() =>
  props.items.map((el) => (typeof el === 'string' ? { src: el } : el))
)
// count of images
const itemCount = computed(() => props.items.length)

// image list for rendering
const renderItems = computed(() => [...computedItems.value, computedItems.value[0]])

// current visible item index.
const currentIndex = ref(0)

// Width value for calculating the movement distance
const numberWidth = computed(() => carouselContainer.value?.offsetWidth ?? 0)

// Height value for calculating the movement distance
const numberHeight = computed(() => carouselContainer.value?.offsetHeight ?? 0)

// 컴포저블로 대체한 렌더링 관련 친구들 추가
const {
  itemsTranslate,
  defaultTransition,
  transition,
  } = useRenderTransition(props, renderItems, currentIndex, numberWidth, numberHeight)

const {
  clickNext,
  clickPrev,
  clickDot,
  pauseSlide,
  resumeSlide,
} = useCarouselEvent(props, computedItems, renderItems, currentIndex, defaultTransition, transition)

// It returns the flex-direction property value based on the received direction.
const direction = computed(() => props.direction)
const flexDirection = computed(() => {
  switch (direction.value) {
    case 'left':
      return 'row'
    case 'up':
      return 'column'
    case 'down':
      return 'column-reverse'
    default:
      return 'row-reverse'
  }
})

// 아이템 엘리먼트의 스타일
const itemStyle: ComputedRef<CSSProperties> = computed(() => ({
  overflow: 'hidden',
  width: numberWidth.value + 'px',
  height: numberHeight.value + 'px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))
</script>
<template>
  <div
    :style="{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      width: props.width,
      height: props.height
    }"
  >
    <div
      class="slider"
      :style="{
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%'
      }"
      @mouseenter="pauseSlide"
      @focusin="pauseSlide"
      @mouseleave="resumeSlide"
      @focusout="resumeSlide"
    >
      <prev-button v-if="arrowOptions?.prev.show || showPrev" @click-prev-button="clickPrev" />
      <div
        ref="carouselContainer"
        :style="{
          overflow: 'hidden',
          position: 'relative',
          flex: 1
        }"
      >
        <div
          class="wrapper-carousel-items"
          :style="{
            display: 'inline-flex',
            position: 'relative',
            flexDirection: flexDirection,
            transform: itemsTranslate,
            transition: transition
          }"
        >
          <div
            v-for="(item, index) in renderItems"
            :key="index"
            :style="itemStyle"
            class="carousel-item"
          >
            <slot name="item" v-bind="item" :style="{ width, height }">
              <img
                :src="item.src"
                :alt="`directiional-carousel-item-${index}`"
                :style="{
                  width: '100%'
                }"
              />
            </slot>
          </div>
        </div>
      </div>
      <next-button v-if="arrowOptions?.next.show || showNext" @click-next-button="clickNext" />
    </div>
    <dot-buttons
      v-if="showDots"
      :current-index="currentIndex"
      :item-count="itemCount"
      :show-dots="showDots"
      @click-dot-button="clickDot"
    />
  </div>
</template>
