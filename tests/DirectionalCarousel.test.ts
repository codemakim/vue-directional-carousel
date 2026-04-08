// src/tests/DirectionalCarousel.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nextTick } from 'vue';
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

  describe('v-model:currentIndex', () => {
    it('respects initial currentIndex prop', () => {
      const w = mount(DirectionalCarousel, {
        props: { items: mockItems, currentIndex: 2 }
      });
      const items = w.findAll('.carousel-item');
      expect(items[2].attributes('aria-hidden')).toBe('false');
      expect(items[0].attributes('aria-hidden')).toBe('true');
    });

    it('moves the slide when parent updates currentIndex', async () => {
      const w = mount(DirectionalCarousel, {
        props: { items: mockItems, currentIndex: 0 }
      });
      await w.setProps({ currentIndex: 2 });
      const items = w.findAll('.carousel-item');
      expect(items[2].attributes('aria-hidden')).toBe('false');
    });

    it('emits update:currentIndex when next button is clicked', async () => {
      const w = mount(DirectionalCarousel, { props: { items: mockItems } });
      await w.find('.next-button').trigger('click');
      const events = w.emitted('update:currentIndex');
      expect(events).toBeTruthy();
      expect(events![events!.length - 1]).toEqual([1]);
    });

    it('emits update:currentIndex when prev button is clicked', async () => {
      const w = mount(DirectionalCarousel, {
        props: { items: mockItems, currentIndex: 1 }
      });
      await nextTick();
      await w.find('.prev-button').trigger('click');
      const events = w.emitted('update:currentIndex');
      expect(events).toBeTruthy();
      expect(events![events!.length - 1]).toEqual([0]);
    });

    it('emits update:currentIndex when a dot button is clicked', async () => {
      const w = mount(DirectionalCarousel, { props: { items: mockItems } });
      const dots = w.findAll('button[aria-label^="Go to slide"]');
      await dots[2].trigger('click');
      const events = w.emitted('update:currentIndex');
      expect(events).toBeTruthy();
      expect(events![events!.length - 1]).toEqual([2]);
    });

    it('exposes a normalized index (always within [0, itemCount-1])', async () => {
      const w = mount(DirectionalCarousel, { props: { items: mockItems } });
      // Click next on the last slide to trigger wrap-around.
      await w.setProps({ currentIndex: 2 });
      await w.find('.next-button').trigger('click');
      const events = w.emitted('update:currentIndex')!;
      // Every emitted value must be within range.
      for (const ev of events) {
        const v = ev[0] as number;
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(mockItems.length);
      }
    });

    it('warns and ignores out-of-range currentIndex', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const w = mount(DirectionalCarousel, {
        props: { items: mockItems, currentIndex: 0 }
      });
      await w.setProps({ currentIndex: 99 });
      expect(warn).toHaveBeenCalled();
      // Should not have moved past the valid range.
      const items = w.findAll('.carousel-item');
      expect(items[0].attributes('aria-hidden')).toBe('false');
      warn.mockRestore();
    });

    it('warns and ignores negative currentIndex', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const w = mount(DirectionalCarousel, {
        props: { items: mockItems, currentIndex: 1 }
      });
      await w.setProps({ currentIndex: -1 });
      expect(warn).toHaveBeenCalled();
      const items = w.findAll('.carousel-item');
      expect(items[1].attributes('aria-hidden')).toBe('false');
      warn.mockRestore();
    });

    it('keeps working without v-model binding (uncontrolled fallback)', async () => {
      const w = mount(DirectionalCarousel, { props: { items: mockItems } });
      await w.find('.next-button').trigger('click');
      const items = w.findAll('.carousel-item');
      expect(items[1].attributes('aria-hidden')).toBe('false');
    });

    // Regression: before the fix, transition was disabled on mount and only restored
    // inside setTransition()/next(). Programmatic index changes (v-model), dot clicks,
    // and the non-wrap prev click would move instantly without animation until the
    // user happened to click the next arrow once. The fix re-enables transition
    // after two requestAnimationFrame ticks in onMounted.
    it('has transition enabled after initial layout so programmatic changes animate', async () => {
      const w = mount(DirectionalCarousel, { props: { items: mockItems } });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });
      await nextTick();
      const slider = w.find('.wrapper-carousel-items');
      const style = slider.attributes('style') || '';
      expect(style).toMatch(/transition:\s*transform/);
    });
  });
});