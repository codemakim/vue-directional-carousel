// src/tests/DirectionalCarousel.test.ts
import { flushPromises, mount } from '@vue/test-utils';
import DirectionalCarousel from 'src/components/DirectionalCarousel.vue';
import { describe, it, expect } from 'vitest';

describe('DirectionalCarousel.vue', () => {
  it('renders the carousel with default props', () => {
    const wrapper = mount(DirectionalCarousel, {
      props: {
        items: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      },
    });

    // 기본 렌더링 확인
    expect(wrapper.exists()).toBe(true);

    // 슬라이드 이미지 갯수 확인
    const slides = wrapper.findAll('.carousel-item');
    expect(slides.length).toBe(4); // items + 첫 번째 아이템 추가
  });

  it('moves to the next slide when next button is clicked', async () => {
    const wrapper = mount(DirectionalCarousel, {
      props: {
        items: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
        showNext: true,
      },
    });

    const nextButton = wrapper.find('button.next-button');
    await nextButton.trigger('click');
    expect(wrapper.vm.currentIndex).toBe(1); // 첫번째 슬라이드에서 두번째로 이동
  });

  it('moves to the previous slide when prev button is clicked', async () => {
    const wrapper = mount(DirectionalCarousel, {
      props: {
        items: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
        showPrev: true,
      },
    });

    const prevButton = wrapper.find('button.prev-button');
    await prevButton.trigger('click');
    expect(wrapper.vm.currentIndex).toBe(wrapper.vm.items.length); // 첫 슬라이드에서 마지막 슬라이드로 이동
  });
});