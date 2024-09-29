import React from 'react'

const InputStyle: React.FC<{
  className?: string
  initialValue: any
  currentValue: any
  setCurrentValue: (cv: any) => void
  onValueChange: (newValue: any) => void
  disabled: boolean
  htmlType: string
  classNameBg?: string
}> = ({ currentValue, setCurrentValue, onValueChange, disabled, htmlType, classNameBg }) => {
  return (
    <input
      disabled={disabled}
      className={`text-sm rounded-sm border-bg7 dark:border-bg7dark focus:border-prim4 focus:dark:border-prim6 p-3 outline-none block w-full transition-all
        ${classNameBg ? classNameBg : 'bg-bg4 dark:bg-bg4dark'}
        ${disabled ? '' : 'border-b-2 hover:bg-bg5 dark:hover:bg-bg5dark'}
        `}
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
