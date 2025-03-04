import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { CarouselComputedItemsType } from '@/types/props'

export default function useImageLoading(
  currentIndex?: Ref<number>,
  computedItems?: CarouselComputedItemsType
) {
  const loadingStates = ref<Map<string, boolean>>(new Map())
  const errorStates = ref<Map<string, boolean>>(new Map())
  const loadedImages = ref<Set<string>>(new Set())

  const handleImageLoad = (src: string) => {
    loadingStates.value.set(src, false)
    errorStates.value.set(src, false)
    loadedImages.value.add(src)
  }

  const handleImageError = (src: string) => {
    loadingStates.value.set(src, false)
    errorStates.value.set(src, true)
  }

  const preloadImage = (src: string) => {
    if (!src || loadedImages.value.has(src)) return

    loadingStates.value.set(src, true)
    const img = new Image()
    img.onload = () => handleImageLoad(src)
    img.onerror = () => handleImageError(src)
    img.src = src
  }

  // 현재와 다음 이미지 프리로드 (옵셔널)
  if (currentIndex && computedItems) {
    watch([currentIndex, computedItems], () => {
      const currentItem = computedItems.value[currentIndex.value]
      const nextIndex = (currentIndex.value + 1) % computedItems.value.length
      const nextItem = computedItems.value[nextIndex]

      if (currentItem?.src) preloadImage(currentItem.src)
      if (nextItem?.src) preloadImage(nextItem.src)
    }, { immediate: true })
  }

  return {
    loadingStates,
    errorStates,
    loadedImages,
    handleImageLoad,
    handleImageError,
    preloadImage
  }
} 