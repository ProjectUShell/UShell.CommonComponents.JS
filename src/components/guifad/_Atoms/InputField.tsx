import React, { useEffect, useState } from 'react'

const InputField: React.FC<{
  className?: string
  label: string
  inputType: string
  initialValue: any
  onValueChange: (newValue: any) => void
}> = ({ className, label, inputType, initialValue, onValueChange }) => {
  const [currentValue, setCurrentValue] = useState<any>(null)

  useEffect(() => {
    function getInitialValue(initialValue: any): any {
      if (inputType == 'DateTime') {
        const r = new Date('2024-04-12').toISOString().replace(/T.*/, '')
        // const r = '2024-04-12'
        console.log('getInitialValue', r)
        return r
      }
      return initialValue
    }
    setCurrentValue(getInitialValue(initialValue))
  }, [initialValue, inputType])

  function getInputType(propertyType: string) {
    switch (propertyType) {
      case 'Int32':
        return 'number'
      case 'DateTime':
        return 'date'
    }
    return 'text'
  }

  console.log('currentValue label', label)
  console.log('currentValue', currentValue)
  return (
    <div className={className}>
      <label className='block mb-2 text-xs font-medium'>{label}</label>
      <input
        className='text-sm rounded-md bg-backgroundone dark:bg-backgroundonedark focus:ring-blue-400 block w-full p-2.5'
        type={getInputType(inputType)}
        value={currentValue || undefined}
        onChange={(e) => {
          onValueChange(e.target.value)
          setCurrentValue(e.target.value)
        }}
      ></input>
    </div>
  )
}

export default InputField
