import React, { useEffect, useState } from 'react'

export interface Option {
  label: string
  value: any
}

interface MultiSelectCheckboxProps {
  options: Option[]
  initialValues: any[]
  onSelectionChange: (selectedValues: any[]) => void
}

const MultiSelect: React.FC<MultiSelectCheckboxProps> = ({
  options,
  initialValues,
  onSelectionChange,
}) => {
  // const [selectedValues, setSelectedValues] = useState<any[]>(initialValues)

  // useEffect(() => {
  //   setSelectedValues(initialValues)
  // }, [initialValues])

  const handleCheckboxChange = (value: any) => {
    const isChecked = initialValues.includes(value)
    if (isChecked) {
      onSelectionChange(initialValues.filter((v) => v !== value))
    } else {
      onSelectionChange([...initialValues, value])
    }
  }

  // React.useEffect(() => {
  //   onSelectionChange(selectedValues)
  // }, [selectedValues, onSelectionChange])

  return (
    <div className='flex flex-col h-full overflow-auto'>
      {options.map((option) => (
        <label
          key={option.value}
          className='flex items-center space-x-2 p-2 hover:bg-bg4 dark:hover:bg-bg4dark'
        >
          <input
            type='checkbox'
            value={option.value}
            checked={initialValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className='form-checkbox h-4 w-4 accent-blue-400'
          />
          <span className='text-sm font-normal px-4'>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default MultiSelect
