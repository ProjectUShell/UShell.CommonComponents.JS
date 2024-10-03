import React from 'react'
import DropdownSelect from '../../../_Atoms/DropdownSelect'

const BoolInputField: React.FC<{
  className?: string
  initialValue: any
  currentValue: any
  setCurrentValue: (cv: any) => void
  onValueChange: (newValue: any) => void
  disabled: boolean
}> = ({ initialValue, setCurrentValue, onValueChange, disabled, className }) => {
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
      inputClassname={className}
    ></DropdownSelect>
  )
}

export default BoolInputField
