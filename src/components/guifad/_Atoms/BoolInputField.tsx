import React from 'react'
import DropdownSelect from '../../../_Atoms/DropdownSelect'

const BoolInputField: React.FC<{
  className?: string
  initialValue: any
  currentValue: any
  setCurrentValue: (cv: any) => void
  onValueChange: (newValue: any) => void
  disabled: boolean
  classNameBg?: string
}> = ({ initialValue, currentValue, setCurrentValue, onValueChange, disabled, classNameBg }) => {
  console.log('initialValue', initialValue)
  return (
    <DropdownSelect
      options={[
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ]}
      onOptionSet={(o) => {
        setCurrentValue(o?.value)
        onValueChange(o?.value)
      }}
      initialOption={{ label: initialValue ? 'Yes' : 'No', value: initialValue }}
      topOffset={0}
      inputClassname='rounded-sm border-b-2 border-bg7 dark:border-bg7dark focus:border-prim4 focus:dark:border-prim6
        p-3 w-full transition-all bg-bg4 dark:bg-bg4dark'
    ></DropdownSelect>
  )
}

export default BoolInputField
