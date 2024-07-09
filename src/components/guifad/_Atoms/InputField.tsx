import React, { useEffect, useState } from 'react'
import { EntitySchemaService } from '../../../data/EntitySchemaService'

const InputField: React.FC<{
  className?: string
  label: string
  inputType: string
  initialValue: any
  onValueChange: (newValue: any) => void
}> = ({ className, label, inputType, initialValue, onValueChange }) => {
  const [currentValue, setCurrentValue] = useState<any>(initialValue)

  useEffect(() => {
    function getInitialValue(initialValue: any): any {
      const htmlType: string = EntitySchemaService.getHtmlInputType(inputType)
      if (htmlType == 'date') {
        if (!initialValue) {
          return new Date().toISOString().replace(/T.*/, '')
        }
        return new Date(initialValue).toISOString().replace(/T.*/, '')
      }
      if (initialValue) return initialValue

      if (htmlType == 'text') return ''
      if (htmlType == 'number') return 0

      return initialValue
    }
    setCurrentValue(getInitialValue(initialValue))
  }, [initialValue, inputType])

  return (
    <div className={className}>
      <label className='block mb-2 text-xs font-medium'>{label}</label>
      <input
        className='text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1 border border-contentBorder dark:border-contentBorderDark'
        type={EntitySchemaService.getHtmlInputType(inputType)}
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
