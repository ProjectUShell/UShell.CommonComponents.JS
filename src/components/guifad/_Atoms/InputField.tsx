import React, { useEffect, useState } from 'react'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import GuidInputField from './GuidInputField'
import InputStyle from './InputStyle'
import BoolInputField from './BoolInputField'

const InputField: React.FC<{
  label: string | null
  inputType: string
  initialValue: any
  onValueChange: (newValue: any) => void
  setabilityFlags?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
}> = ({
  label,
  inputType,
  initialValue,
  onValueChange,
  setabilityFlags = 7,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
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
    <div className={`${false ? 'flex justify-between gap-2 items-baseline' : ''}`}>
      {label && (
        <label className='block mb-2 text-xs font-medium whitespace-nowrap align-baseline'>
          {label}
        </label>
      )}
      <div className='w-full'>
        {inputType.toLocaleLowerCase() == 'guid' && (
          <GuidInputField
            initialValue={initialValue}
            currentValue={currentValue}
            setCurrentValue={setCurrentValue}
            onValueChange={onValueChange}
            disabled={disabled}
            classNameBg={classNameBg}
            classNameHoverBg={classNameHoverBg}
            classNameHoverBgDark={classNameHoverBgDark}
          ></GuidInputField>
        )}
        {(inputType.toLocaleLowerCase() == 'bool' ||
          inputType.toLocaleLowerCase() == 'boolean') && (
          <BoolInputField
            initialValue={initialValue}
            currentValue={currentValue}
            setCurrentValue={setCurrentValue}
            onValueChange={onValueChange}
            disabled={disabled}
            classNameBg={classNameBg}
            classNameHoverBg={classNameHoverBg}
            classNameHoverBgDark={classNameHoverBgDark}
          ></BoolInputField>
        )}
        {inputType.toLocaleLowerCase() != 'guid' &&
          inputType.toLocaleLowerCase() != 'bool' &&
          inputType.toLocaleLowerCase() != 'boolean' && (
            <InputStyle
              htmlType={EntitySchemaService.getHtmlInputType(inputType)}
              currentValue={currentValue}
              disabled={disabled}
              initialValue={initialValue}
              onValueChange={onValueChange}
              setCurrentValue={setCurrentValue}
              classNameBg={classNameBg}
              classNameHoverBg={classNameHoverBg}
              classNameHoverBgDark={classNameHoverBgDark}
            ></InputStyle>
          )}
      </div>
    </div>
  )
}

export default InputField
