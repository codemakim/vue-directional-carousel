# vue-directional-carousel

This is a Vue 3 component that allows you to set the direction of image movement not only vertically and horizontally but also in different directions (left, right, up, down).

## Installation

You can install the `vue-directional-carousel` package via npm or yarn:

```bash
npm install vue-directional-carousel
```

or

```bash
yarn install vue-directional-carousel
```

## Usage

- Import the VueDirectionalCarousel component in your Vue.js project:

```javascript
import { DirectionalCarousel } from 'vue-directional-carousel'
```

- Register the VueDirectionalCarousel component locally in your component:

```javascript
// if use options api
export default {
  components: {
    DirectionalCarousel
  }
}
```

- Use the vue-directional-carousel component in your template:

```html
<template>
  <div>
    <directional-carousel
      :items="imageList"
      :show-prev="true"
      :show-next="true"
      :interval="2000"
      direction="down"
      width="100%"
      height="200px"
    />
  </div>
</template>
<script setup>
  import DirectionalCarousel from 'vue-directional-carousel'

  // Define your carousel image here
  const imageList = [
     'src/assets/sample1.png',
     'src/assets/sample2.png',
     'src/assets/sample3.png',
     'src/assets/sample4.png',
     'src/assets/sample5.png',
     ...
  ]
</script>
```

## Props

| props                | type                                | isRequire | default | description                                                                                                                          |
| -------------------- | ----------------------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| items                | string[] \| { src: string}[]        | O         |         | 캐러셀에 사용할 이미지 목록                                                                                                          |
| width                | string                              | X         | '100%'  | 캐러셀의 너비                                                                                                                        |
| height               | string                              | X         | '300px' | 캐러셀의 높이                                                                                                                        |
| directtion           | 'left' \| 'right' \| 'up' \| 'down' | X         | 'right' | 이미지가 흐르는 방향                                                                                                                 |
| duration             | number                              | X         | 1000    | 슬라이드 지속 기간 (짧을 수록 빠르게 흐름)                                                                                           |
| interval             | number                              | X         | 0       | 이미지 자동 슬라이드 간격 (단위: ms). 0으로 설정 시 자동 슬라이드 하지 않음.                                                         |
| pauseAutoplayOnHover | boolean                             | X         | false   | 자동 슬라이드 설정 시 마우스를 캐러셀 내 이미지 위로 둘 경우 자동 슬라이드 정지. 마우스를 영역 밖으로 옮기면 다시 자동 슬라이드 재개 |
| showPrev             | boolean                             | X         | true    | 이전 버튼                                                                                                                            |
| showNext             | boolean                             | X         | true    | 다음 버튼                                                                                                                            |
| showDots             | boolean                             | X         | true    | 현재 이미지 순서 표시 버튼. 클릭 시 해당 이미지로 슬라이드                                                                           |

## Events

추후 기능 추가 예정

## Contributing

## License

MIT
