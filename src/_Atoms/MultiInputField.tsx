import React from 'react'
import { Option } from './MultiSelect'
import DropdownMultiSelect from './DropdownMultiSelect'

const MultiInputField: React.FC<{
  label?: string
  options: Option[]
  initialOptions?: Option[]
  onOptionsSet?: (o: Option[]) => void
  placeholder?: string
  forceFocus?: boolean
  topOffset?: number
  bottomOffset?: number
  styleType?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
}> = ({
  label,
  options,
  initialOptions = [],
  onOptionsSet,
  placeholder,
  forceFocus,
  topOffset,
  bottomOffset,
  styleType = 0,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
}) => {
  return (
    <div className={`w-full ${false ? 'flex justify-between gap-2 items-baseline ' : ''}`}>
      {label && (
        <label className='block mb-2 text-xs font-medium whitespace-nowrap align-baseline'>
          {label}
        </label>
      )}
      <div className='w-full'>
        {
          <DropdownMultiSelect
            options={options}
            initialOptions={initialOptions}
            onOptionsSet={onOptionsSet}
            placeholder={placeholder}
            forceFocus={forceFocus}
            topOffset={topOffset}
            bottomOffset={bottomOffset}
            styleType={styleType}
            classNameBg={classNameBg}
            classNameHoverBg={classNameHoverBg}
            classNameHoverBgDark={classNameHoverBgDark}
          ></DropdownMultiSelect>
        }
      </div>
    </div>
  )
}

export default MultiInputField
