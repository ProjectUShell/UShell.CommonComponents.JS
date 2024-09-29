import React, { useEffect, useState } from 'react'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import GuidInputField from './GuidInputField'
import InputStyle from './InputStyle'

const InputField: React.FC<{
  className?: string
  label: string
  inputType: string
  initialValue: any
  onValueChange: (newValue: any) => void
  setabilityFlags?: number
  classNameBg?: string
}> = ({
  className,
  label,
  inputType,
  initialValue,
  onValueChange,
  setabilityFlags = 7,
  classNameBg,
}) => {
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

  const fixAfterCreation: boolean = setabilityFlags < 6 //TODO adjust setability check after Fix in EntityAnnotations
  const disabled: boolean = fixAfterCreation && initialValue && initialValue != ''
  return (
    <div className={className}>
      <label className='block mb-2 text-xs font-medium'>{label}</label>
      {inputType.toLocaleLowerCase() == 'guid' && (
        <GuidInputField
          initialValue={initialValue}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          onValueChange={onValueChange}
          className={className}
          disabled={disabled}
          classNameBg={classNameBg}
        ></GuidInputField>
      )}
      {inputType.toLocaleLowerCase() != 'guid' && (
        <InputStyle
          htmlType={EntitySchemaService.getHtmlInputType(inputType)}
          currentValue={currentValue}
          disabled={disabled}
          initialValue={initialValue}
          onValueChange={onValueChange}
          setCurrentValue={setCurrentValue}
          classNameBg={classNameBg}
        ></InputStyle>
      )}
    </div>
  )
}

export default InputField
