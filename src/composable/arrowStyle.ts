import { type Ref, type CSSProperties, ref } from 'vue'

export function useArrowStyle() {
  // button Wrapper CSS style
  const buttonWrapperStyle: Ref<CSSProperties> = ref({
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px'
  })

  // button CSS Style
  const buttonStyle: Ref<CSSProperties> = ref({
    height: '20px',
    border: 'none',
    color: 'silver',
    borderRadius: '10px'
  })

  /**
   * button handler - mouse down
   */
  const onMouseDownButton = () => {
    buttonStyle.value.color = 'gray'
  }
  /**
   * button handler - mouse up
   */
  const onMouseUpButton = () => {
    buttonStyle.value.color = 'silver'
  }

  return {
    buttonWrapperStyle,
    buttonStyle,
    onMouseDownButton,
    onMouseUpButton
  }
}
