import React, { useEffect, useState } from 'react'

const InputField: React.FC<{
  className?: string
  label: string
  inputType: string
  initialValue: any
  onValueChange: (newValue: any) => void
}> = ({ className, label, inputType, initialValue, onValueChange }) => {
  const [currentValue, setCurrentValue] = useState(initialValue)
  console.log('input type', inputType)

  function getInputType(propertyType: string) {
    switch (propertyType) {
      case 'Int32':
        return 'number'
      case 'DateTime':
        return 'date'
    }
    return 'text'
  }

  return (
    <div className={className}>
      <label className='block mb-2 text-xs font-medium'>{label}</label>
      <input
        className='text-sm rounded-lg bg-backgroundone dark:bg-backgroundonedark focus:ring-blue-400 block w-full p-2.5'
        type={getInputType(inputType)}
        value={currentValue}
        onChange={(e) => {
          onValueChange(e.target.value)
          setCurrentValue(e.target.value)
        }}
      ></input>
    </div>
  )
}

export default InputField
