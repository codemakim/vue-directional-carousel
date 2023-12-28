export type VerticalCarouselItem = string | {
    src: string;
};
export interface VerticalCarouselProps {
    width?: string;
    height?: string;
    items: VerticalCarouselItem[];
    direction?: 'left' | 'right' | 'up' | 'down';
    duration?: number;
    showPrev?: boolean;
    showNext?: boolean;
    showDots?: boolean;
    interval?: number;
    pauseAutoplayOnHover?: boolean;
}
export interface DotButtonsProps {
    currentIndex: number;
    itemCount: number;
    showDots: boolean;
}
