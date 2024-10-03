import React from 'react'
import { getInputStyleClassName } from './InputField'

const InputStyle: React.FC<{
  initialValue: any
  currentValue: any
  setCurrentValue: (cv: any) => void
  onValueChange: (newValue: any) => void
  disabled: boolean
  htmlType: string
  classNameBg?: string
  classNameBgDark?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
  styleType?: number
}> = ({
  currentValue,
  setCurrentValue,
  onValueChange,
  disabled,
  htmlType,
  classNameBg,
  classNameBgDark,
  classNameHoverBg,
  classNameHoverBgDark,
  styleType = 0,
}) => {
  const className: string = getInputStyleClassName(
    styleType,
    classNameBg,
    classNameBgDark,
    disabled,
    classNameHoverBg,
    classNameHoverBgDark,
  )
  return (
    <input
      disabled={disabled}
      className={className}
      type={htmlType}
      value={currentValue}
      onChange={(e) => {
        onValueChange(e.target.value)
        setCurrentValue(e.target.value)
      }}
    ></input>
  )
}

export default InputStyle
