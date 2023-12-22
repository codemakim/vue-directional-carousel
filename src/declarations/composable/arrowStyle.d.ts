import { type Ref, type CSSProperties } from 'vue';
export declare function useArrowStyle(): {
    buttonWrapperStyle: Ref<CSSProperties>;
    buttonStyle: Ref<CSSProperties>;
    onMouseDownButton: () => void;
    onMouseUpButton: () => void;
};
