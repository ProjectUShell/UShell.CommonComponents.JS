import React, { useState } from 'react'
import InputStyle from './InputStyle'

const GuidInputField: React.FC<{
  className?: string
  initialValue: any
  currentValue: any
  setCurrentValue: (cv: any) => void
  onValueChange: (newValue: any) => void
  disabled: boolean
  classNameBg?: string
}> = ({ initialValue, currentValue, setCurrentValue, onValueChange, disabled, classNameBg }) => {
  console.log('initialValue', initialValue)

  function generateGuid() {
    const guid = crypto.randomUUID()
    onValueChange(guid)
    setCurrentValue(guid)
  }

  return (
    <div className='flex gap-1'>
      <InputStyle
        htmlType='text'
        currentValue={currentValue}
        disabled={disabled}
        initialValue={initialValue}
        onValueChange={onValueChange}
        setCurrentValue={setCurrentValue}
        classNameBg={classNameBg}
      ></InputStyle>
      {!disabled && (
        <button
          disabled={disabled}
          className={`bg-toolbar dark:bg-toolbarDark p-1 rounded-md
            hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark`}
          onClick={() => generateGuid()}
        >
          Generate
        </button>
      )}
    </div>
  )
}

export default GuidInputField
