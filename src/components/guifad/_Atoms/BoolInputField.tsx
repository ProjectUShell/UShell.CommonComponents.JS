import React from 'react'
import DropdownSelect from '../../../_Atoms/DropdownSelect'

const BoolInputField: React.FC<{
  initialValue: any
  currentValue: any
  setCurrentValue: (cv: any) => void
  onValueChange: (newValue: any) => void
  disabled: boolean
  styleType?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
}> = ({
  initialValue,
  setCurrentValue,
  onValueChange,
  disabled,
  styleType = 0,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
}) => {
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
      classNameBg={classNameBg}
      classNameHoverBg={classNameHoverBg}
      classNameHoverBgDark={classNameHoverBgDark}
      styleType={styleType}
    ></DropdownSelect>
  )
}

export default BoolInputField
