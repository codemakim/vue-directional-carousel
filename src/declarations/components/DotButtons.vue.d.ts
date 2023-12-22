declare const _default: import("vue").DefineComponent<{
    currentIndex: {
        type: import("vue").PropType<number>;
        required: true;
        default: number;
    };
    itemCount: {
        type: import("vue").PropType<number>;
        required: true;
        default: number;
    };
    showDots: {
        type: import("vue").PropType<boolean>;
        required: true;
        default: boolean;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "click-dot-button": (...args: any[]) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    currentIndex: {
        type: import("vue").PropType<number>;
        required: true;
        default: number;
    };
    itemCount: {
        type: import("vue").PropType<number>;
        required: true;
        default: number;
    };
    showDots: {
        type: import("vue").PropType<boolean>;
        required: true;
        default: boolean;
    };
}>> & {
    "onClick-dot-button"?: ((...args: any[]) => any) | undefined;
}, {
    currentIndex: number;
    itemCount: number;
    showDots: boolean;
}, {}>;
export default _default;
