<!-- eslint-disable vue/no-setup-props-destructure -->

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  type ComputedRef,
  type CSSProperties
} from 'vue'
import { type VerticalCarouselProps } from '../types/props'

const TRANSLATE = 'translate'

const props = withDefaults(defineProps<VerticalCarouselProps>(), {
  width: '400px',
  height: '300px',
  direction: 'right',
  duration: 1000,
  showPrev: true,
  showNext: true,
  interval: 2000,
  pauseAutoplayOnHover: false
})
// 렌더링에 사용할 아이템 목록
const renderItems = computed(() => [...props.items, props.items[0]])
// 현재 보여지는 아이템 인덱스
const currentIndex = ref(0)
// 이동 거리 계산을 위한 너비 값
const numberWidth = computed(() => parseInt(props.width, 10))
// 이동 거리 계산을 위한 높이 값
const numberHeight = computed(() => parseInt(props.height, 10))

/**
 * direction 값이 right, up인 경우 인덱스에 따른 거리 값이 큰 수 부터 작은 수 순으로 출력됩니다.
 * direction 값이 left, right인 경우 width를 기준으로 거리 값을 계산하며,
 */
const slideDistinct = computed(() => {
  // down, right인 경우 큰수부터 작은수 순으로 만들자.
  const axis = ['left', 'right'].includes(props.direction) ? numberWidth.value : numberHeight.value
  const distinct = ['up', 'left'].includes(props.direction)
    ? currentIndex.value % renderItems.value.length
    : renderItems.value.length - (currentIndex.value + (1 % renderItems.value.length))
  return distinct * axis
})

// direction 값에 따른 축 값
const directionAxis = computed(() => (['left', 'right'].includes(props.direction) ? 'X' : 'Y'))

// 현재 화면에 표시되어야 하는 아이템의 인덱스를 이용해 만든 translate 값
const itemsTranslate = computed(() => {
  return `${TRANSLATE}${directionAxis.value}(-${slideDistinct.value}px)`
})

// translate 동작 Duration 값 원본
const defaultTransition = ref(`transform ${props.duration / 1000}s ease`)

// 초기화 과정에서 원본 ( defaultTransition )을 보존하기 위한 값
const transition = ref(defaultTransition.value)

// 전달 받은 방향 값을 이용해 flex-direction 속성 값을 반환합니다.
const getDirection = (direction: string) => {
  switch (direction) {
    case 'left':
      return 'row'
    case 'up':
      return 'column'
    case 'down':
      return 'column-reverse'
    default:
      return 'row-reverse'
  }
}

// 취상위 엘리먼트의 CSS 스타일
const rootStyle: CSSProperties = {
  overflow: 'hidden',
  position: 'relative',
  width: props.width,
  height: props.height
}

// 아이템 목록 엘리먼트의 스타일
const containerStyle: ComputedRef<CSSProperties> = computed(() => ({
  display: 'inline-flex',
  flexDirection: getDirection(props.direction),
  transform: itemsTranslate.value,
  transition: transition.value
}))

// 아이템 엘리먼트의 스타일
const itemStyle: ComputedRef<CSSProperties> = computed(() => ({
  width: props.width,
  height: props.height
}))

/**
 * item에 현재 index에 맞는 translate 속성을 부여
 * @return void
 */
const setTransition = () => {
  currentIndex.value = ++currentIndex.value % renderItems.value.length
  transition.value = defaultTransition.value
}

/**
 * 아이템이 다음 순서로 슬라이드 동작하도록 하기 위한 이벤트 핸들러
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
 * TODO: 실제 구동한 적이 없으며, 추가 개발이 필요함
 * 아이템이 이전 순서로 슬라이드 동작하도록 하기 위한 이벤트 핸들러
 * @return void
 */
const prev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + renderItems.value.length) % renderItems.value.length
}

// setIntervaldl 담길 변수
let autoSlideInterval: number

const watchItems = computed(() => props.items)
const watchInterval = computed(() => props.interval)

watch([watchItems, watchInterval], () => {
  clearInterval(autoSlideInterval)

  if (watchItems.value.length > 1) {
    autoSlideInterval = setInterval(next, watchInterval.value)
  }
})

const isPaused = ref(false)

/**
 * 슬라이드 동작 일시 정지
 * @return void
 */
const pauseSlide = () => {
  if (props.pauseAutoplayOnHover) {
    clearInterval(autoSlideInterval)
    isPaused.value = true
  }
}

/**
 * 슬라이드 동작 재게
 * @return void
 */
const resumeSlide = () => {
  if (props.pauseAutoplayOnHover && isPaused.value) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = setInterval(next, props.interval)
    isPaused.value = false
  }
}

onMounted(() => {
  if (props.items.length > 1) {
    autoSlideInterval = setInterval(next, props.interval)
  }
})

onBeforeUnmount(() => {
  clearInterval(autoSlideInterval)
})
</script>
<template>
  <div
    :style="rootStyle"
    @mouseenter="pauseSlide"
    @focusin="pauseSlide"
    @mouseleave="resumeSlide"
    @focusout="resumeSlide"
  >
    <div :style="containerStyle" class="wrapper-carousel-items">
      <div
        v-for="(item, index) in renderItems"
        :key="index"
        :style="itemStyle"
        class="carousel-item"
      >
        <slot name="item" v-bind="item" :style="{ width, height }" />
      </div>
    </div>
  </div>
  <button v-if="showPrev" class="prev-button" @click="prev">Prev</button>
  <button v-if="showNext" class="next-button" @click="next">Next</button>
</template>
