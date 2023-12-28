<!-- eslint-disable vue/no-setup-props-destructure -->

<script setup lang="ts">
import { type VerticalCarouselProps } from '../propTypes/props'
import {
  type Ref,
  type ComputedRef,
  type CSSProperties,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch
} from 'vue'
import DotButtons from './DotButtons.vue'
import PrevButton from './PrevButton.vue'
import NextButton from './NextButton.vue'

const TRANSLATE = 'translate'

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

// Value determining the axis
const axis = computed(() =>
  ['left', 'right'].includes(props.direction) ? numberWidth.value : numberHeight.value
)

// Value determining the distance
const distinct = computed(() =>
  ['up', 'left'].includes(props.direction)
    ? currentIndex.value % renderItems.value.length
    : renderItems.value.length - (currentIndex.value + (1 % renderItems.value.length))
)

/**
 * When the direction is right or up, the distance values are output from the largest to the smallest according to the index.
 * When the direction is left or right, the distance is calculated based on the width.
 */
const slideDistinct = computed(() => {
  return distinct.value * axis.value
})

// Axis value based on the direction
const directionAxis = computed(() => (['left', 'right'].includes(props.direction) ? 'X' : 'Y'))

// Translate value created using the index of the items currently visible on the screen
const itemsTranslate = computed(() => {
  return `${TRANSLATE}${directionAxis.value}(-${slideDistinct.value}px)`
})

// default transition value
const defaultTransition = ref(`transform ${props.duration / 1000}s ease`)

// To preserve the original ( defaultTransition ) during initialization.
const transition = ref(defaultTransition.value)

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

/**
 * Applies the translate property to the item based on the current index.
 * @return void
 */
const setTransition = () => {
  currentIndex.value = ++currentIndex.value % renderItems.value.length
  transition.value = defaultTransition.value
}

/**
 * Event handler to make items slide to the next order.
 * @return void
 */
const next = () => {
  if (currentIndex.value >= renderItems.value.length - 1) {
    transition.value = ''
    currentIndex.value = 0
    setTimeout(() => {
      setTransition()
    }, 100)
  } else {
    setTransition()
  }
}

/**
 * The translation for the phrase.
 * Reset the interval when next or prev buttons are clicked or when the slide action is resumed.
 */
const initInterval = () => {
  window.clearInterval(autoSlideInterval)
  autoSlideInterval = window.setInterval(next, props.interval)
}

/**
 * click next button event handler
 */
const clickNext = () => {
  next()
  if (props.interval) {
    initInterval()
  }
}

// index of previous item
const prevIndex = computed(
  () => (currentIndex.value - 1 + renderItems.value.length) % renderItems.value.length
)

/**
 * click prev button event handler
 * @return void
 */
const clickPrev = () => {
  if (currentIndex.value === 0) {
    transition.value = ''
    currentIndex.value = prevIndex.value
    setTimeout(() => {
      currentIndex.value = prevIndex.value
      transition.value = defaultTransition.value
    }, 100)
  } else {
    currentIndex.value = prevIndex.value
  }
  if (props.interval) {
    initInterval()
  }
}

/**
 * clicked dot button event handler
 */
const clickDot = (index: number) => {
  currentIndex.value = index
  if (props.interval) {
    initInterval()
  }
}

// variables of setInterval
let autoSlideInterval: number

const watchItems = computed(() => computedItems.value)
const watchInterval = computed(() => props.interval)

watch([watchItems, watchInterval], () => {
  if (watchInterval.value) {
    window.clearInterval(autoSlideInterval)
    if (watchItems.value.length > 1) {
      autoSlideInterval = window.setInterval(next, watchInterval.value)
    }
  }
})

const isPaused = ref(false)

/**
 * Pause slide action
 * @return void
 */
const pauseSlide = () => {
  if (props.pauseAutoplayOnHover) {
    window.clearInterval(autoSlideInterval)
    isPaused.value = true
  }
}

/**
 * Resume slide action
 * @return void
 */
const resumeSlide = () => {
  if (props.pauseAutoplayOnHover && isPaused.value) {
    initInterval()
    isPaused.value = false
  }
}

onMounted(() => {
  transition.value = ''
  if (computedItems.value.length > 1 && props.interval) {
    autoSlideInterval = window.setInterval(next, props.interval)
  }
})

onBeforeUnmount(() => {
  window.clearInterval(autoSlideInterval)
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
      <prev-button v-if="showPrev" @click-prev-button="clickPrev" />
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
                :alt="`directiional-carousel-image-${index}`"
                :style="{
                  width: '100%'
                }"
              />
            </slot>
          </div>
        </div>
      </div>
      <next-button v-if="showNext" @click-next-button="clickNext" />
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
