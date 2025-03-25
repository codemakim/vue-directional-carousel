// src/tests/DirectionalCarousel.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import DirectionalCarousel from '../src/components/DirectionalCarousel.vue';

describe('DirectionalCarousel', () => {
  const mockItems = [
    { src: 'image1.jpg' },
    { src: 'image2.jpg' },
    { src: 'image3.jpg' }
  ];

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(DirectionalCarousel, {
      props: {
        items: mockItems,
        width: '800px',
        height: '400px',
        infinite: false
      }
    });
  });

  it('renders the carousel with correct number of items', () => {
    const items = wrapper.findAll('.carousel-item');
    expect(items).toHaveLength(mockItems.length + 1);
  });

  it('shows correct initial slide', () => {
    const items = wrapper.findAll('.carousel-item');
    expect(items[0].attributes('aria-hidden')).toBe('false');
    expect(items[1].attributes('aria-hidden')).toBe('true');
  });

  it('navigates to next slide when next button is clicked', async () => {
    const nextButton = wrapper.find('.next-button');
    await nextButton.trigger('click');

    const items = wrapper.findAll('.carousel-item');
    expect(items[0].attributes('aria-hidden')).toBe('true');
    expect(items[1].attributes('aria-hidden')).toBe('false');
  });

  it('navigates to previous slide when prev button is clicked', async () => {
    const nextButton = wrapper.find('.next-button');
    await nextButton.trigger('click');

    const prevButton = wrapper.find('.prev-button');
    await prevButton.trigger('click');

    const items = wrapper.findAll('.carousel-item');
    expect(items[0].attributes('aria-hidden')).toBe('false');
    expect(items[1].attributes('aria-hidden')).toBe('true');
  });

  it('handles dot navigation correctly', async () => {
    const buttons = wrapper.findAll('button[aria-label^="Go to slide"]');
    await buttons[1].trigger('click');

    const items = wrapper.findAll('.carousel-item');
    expect(items[1].attributes('aria-hidden')).toBe('false');
    expect(items[0].attributes('aria-hidden')).toBe('true');
  });

  it('handles image error state', async () => {
    const firstImage = wrapper.find('.carousel-image-container img');
    await firstImage.trigger('error');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.carousel-image-error').exists()).toBe(true);
  });

  it('applies width and height from props', () => {
    const carousel = wrapper.find('div');
    const style = carousel.attributes('style');

    expect(style).toContain('width: 800px');
    expect(style).toContain('height: 400px');
  });
});