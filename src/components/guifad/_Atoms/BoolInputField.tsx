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
  classNameDropdownBg?: string
  classNameDropdownHoverBg?: string
  required: boolean
  minWidth?: number
}> = ({
  initialValue,
  setCurrentValue,
  onValueChange,
  disabled,
  styleType = 0,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
  classNameDropdownBg,
  classNameDropdownHoverBg,
  required = false,
  minWidth,
}) => {
  const options: { label: string; value: any }[] = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: -1 },
  ]
  if (!required) {
    options.push({ label: 'Unset', value: undefined })
  }
  return (
    <DropdownSelect
      minWidth={minWidth}
      options={options}
      onOptionSet={(o) => {
        setCurrentValue(o?.value == undefined ? undefined : o?.value == 1 ? true : false)
        onValueChange(o?.value == undefined ? undefined : o?.value == 1 ? true : false)
      }}
      initialOption={{
        label: initialValue == undefined ? 'Unset' : initialValue == true ? 'Yes' : 'No',
        value: initialValue == undefined ? undefined : initialValue == true ? 1 : -1,
      }}
      topOffset={0}
      classNameBg={classNameBg}
      classNameHoverBg={classNameHoverBg}
      classNameHoverBgDark={classNameHoverBgDark}
      classNameDropdownBg={classNameDropdownBg}
      classNameDropdownHoverBg={classNameDropdownHoverBg}
      styleType={styleType}
    ></DropdownSelect>
  )
}

export default BoolInputField
