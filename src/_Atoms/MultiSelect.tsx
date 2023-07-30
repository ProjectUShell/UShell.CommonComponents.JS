import React, { useState } from 'react'

export interface Option {
  label: string
  value: any
}

interface MultiSelectCheckboxProps {
  options: Option[]
  initialValues: any[]
  onSelectionChange: (selectedValues: any[]) => void
}

const MultiSelect: React.FC<MultiSelectCheckboxProps> = ({ options, initialValues, onSelectionChange }) => {
  const [selectedValues, setSelectedValues] = useState<any[]>(initialValues)

  const handleCheckboxChange = (value: any) => {
    const isChecked = selectedValues.includes(value)
    if (isChecked) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  React.useEffect(() => {
    onSelectionChange(selectedValues)
  }, [selectedValues, onSelectionChange])

  return (
    <div className='flex flex-wrap'>
      {options.map((option) => (
        <label key={option.value} className='flex items-center space-x-2 p-2'>
          <input
            type='checkbox'
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className='form-checkbox h-5 w-5 text-blue-600'
          />
          <span className='text-sm'>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default MultiSelect
