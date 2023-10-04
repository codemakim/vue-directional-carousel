<!-- eslint-disable vue/no-setup-props-destructure -->

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  type Ref,
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
  interval: 0,
  pauseAutoplayOnHover: false
})

// 캐러샐 영역의 너비
const wrapperContainer: Ref<HTMLElement | null> = ref(null)

// items가 string[]인 경우 { src: string }[] 형식으로 변경합니다.
const computedItems = computed(() =>
  props.items.map((el) => (typeof el === 'string' ? { src: el } : el))
)

// 렌더링에 사용할 아이템 목록
const renderItems = computed(() => [...computedItems.value, computedItems.value[0]])
// 현재 보여지는 아이템 인덱스
const currentIndex = ref(0)
// 이동 거리 계산을 위한 너비 값
const numberWidth = computed(() => wrapperContainer.value?.offsetWidth ?? 0)
// 이동 거리 계산을 위한 높이 값
const numberHeight = computed(() => wrapperContainer.value?.offsetHeight ?? 0)
// 축을 결정하는 값
const axis = computed(() =>
  ['left', 'right'].includes(props.direction) ? numberWidth.value : numberHeight.value
)
// 거리를 결정하는 값
const distinct = computed(() =>
  ['up', 'left'].includes(props.direction)
    ? currentIndex.value % renderItems.value.length
    : renderItems.value.length - (currentIndex.value + (1 % renderItems.value.length))
)

/**
 * direction 값이 right, up인 경우 인덱스에 따른 거리 값이 큰 수 부터 작은 수 순으로 출력됩니다.
 * direction 값이 left, right인 경우 width를 기준으로 거리 값을 계산하며,
 */
const slideDistinct = computed(() => {
  return distinct.value * axis.value
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
 * 인터벌을 초기화합니다. next, prev 버튼을 클릭하거나, 슬라이드 동작 재게될 때 호출됩니다.
 */
const initInterval = () => {
  clearInterval(autoSlideInterval)
  autoSlideInterval = setInterval(next, props.interval)
}

const clickNext = () => {
  next()
  if (props.interval) {
    initInterval()
  }
}

const prevIndex = computed(
  () => (currentIndex.value - 1 + renderItems.value.length) % renderItems.value.length
)

/**
 * 아이템이 이전 순서로 슬라이드 동작하도록 하기 위한 이벤트 핸들러
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

// setIntervaldl 담길 변수
let autoSlideInterval: number

const watchItems = computed(() => computedItems.value)
const watchInterval = computed(() => props.interval)

watch([watchItems, watchInterval], () => {
  if (watchInterval.value) {
    clearInterval(autoSlideInterval)
    if (watchItems.value.length > 1) {
      autoSlideInterval = setInterval(next, watchInterval.value)
    }
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
    initInterval()
    isPaused.value = false
  }
}

onMounted(() => {
  if (computedItems.value.length > 1 && props.interval) {
    console.log(props.interval)
    autoSlideInterval = setInterval(next, props.interval)
  }
})

onBeforeUnmount(() => {
  clearInterval(autoSlideInterval)
})

// 취상위 엘리먼트의 CSS 스타일
const rootStyle: CSSProperties = {
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  width: props.width,
  height: props.height
}

// button CSS 스타일
const buttonStyle: CSSProperties = {
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

// 아이템 목록 wrapper 엘리먼트의 스타일
const wrapperContainerStyle: CSSProperties = {
  overflow: 'hidden',
  position: 'relative',
  flex: 1
}

// 아이템 목록 엘리먼트의 스타일
const containerStyle: ComputedRef<CSSProperties> = computed(() => ({
  display: 'inline-flex',
  position: 'relative',
  flexDirection: getDirection(props.direction),
  transform: itemsTranslate.value,
  transition: transition.value
}))

// 아이템 엘리먼트의 스타일
const itemStyle: ComputedRef<CSSProperties> = computed(() => ({
  width: numberWidth.value + 'px',
  height: numberHeight.value + 'px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))
</script>
<template>
  <div
    :style="rootStyle"
    @mouseenter="pauseSlide"
    @focusin="pauseSlide"
    @mouseleave="resumeSlide"
    @focusout="resumeSlide"
  >
    <div v-if="showPrev" :style="buttonStyle">
      <button class="prev-button" @click="clickPrev">&lt;</button>
    </div>
    <div ref="wrapperContainer" :style="wrapperContainerStyle">
      <div :style="containerStyle" class="wrapper-carousel-items">
        <div
          v-for="(item, index) in renderItems"
          :key="index"
          :style="itemStyle"
          class="carousel-item"
        >
          <slot name="item" v-bind="item" :style="{ width, height }">
            <div>
              {{ item.src }}
            </div>
          </slot>
        </div>
      </div>
    </div>
    <div v-if="showNext" :style="buttonStyle">
      <button class="next-button" @click="clickNext">&gt;</button>
    </div>
  </div>
</template>
