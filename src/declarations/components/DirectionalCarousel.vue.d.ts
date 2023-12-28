declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    showDots: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    height: {
        type: import("vue").PropType<string>;
        default: string;
    };
    width: {
        type: import("vue").PropType<string>;
        default: string;
    };
    items: {
        type: import("vue").PropType<import("../propTypes/props").VerticalCarouselItem[]>;
        required: true;
    };
    direction: {
        type: import("vue").PropType<"left" | "right" | "up" | "down">;
        default: string;
    };
    duration: {
        type: import("vue").PropType<number>;
        default: number;
    };
    showPrev: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    showNext: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    interval: {
        type: import("vue").PropType<number>;
        default: number;
    };
    pauseAutoplayOnHover: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    showDots: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    height: {
        type: import("vue").PropType<string>;
        default: string;
    };
    width: {
        type: import("vue").PropType<string>;
        default: string;
    };
    items: {
        type: import("vue").PropType<import("../propTypes/props").VerticalCarouselItem[]>;
        required: true;
    };
    direction: {
        type: import("vue").PropType<"left" | "right" | "up" | "down">;
        default: string;
    };
    duration: {
        type: import("vue").PropType<number>;
        default: number;
    };
    showPrev: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    showNext: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    interval: {
        type: import("vue").PropType<number>;
        default: number;
    };
    pauseAutoplayOnHover: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
}>>, {
    showDots: boolean;
    height: string;
    width: string;
    direction: "left" | "right" | "up" | "down";
    duration: number;
    showPrev: boolean;
    showNext: boolean;
    interval: number;
    pauseAutoplayOnHover: boolean;
}, {}>, {
    item?(_: {
        style: {
            width: string;
            height: string;
        };
        src: string;
    }): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
