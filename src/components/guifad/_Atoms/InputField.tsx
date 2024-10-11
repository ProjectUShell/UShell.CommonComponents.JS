import React, { useEffect, useState } from 'react'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import GuidInputField from './GuidInputField'
import InputStyle from './InputStyle'
import BoolInputField from './BoolInputField'
import DropdownSelect from '../../../_Atoms/DropdownSelect'

const InputField: React.FC<{
  label: string | null
  inputType: string
  initialValue: any
  onValueChange: (newValue: any) => void
  allowedValues?: { [key: string]: string }
  setabilityFlags?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
  multiLine?: boolean
  styleType?: number
  readOnly?: boolean
}> = ({
  label,
  inputType,
  initialValue,
  onValueChange,
  allowedValues,
  setabilityFlags = 7,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
  multiLine = false,
  styleType = 0,
  readOnly = false,
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
  const disabled: boolean = readOnly || (fixAfterCreation && initialValue && initialValue != '')
  const classNameInput: string = getInputStyleClassName(
    styleType,
    classNameBg,
    disabled,
    classNameHoverBg,
    classNameHoverBgDark,
  )
  function renderInnerInput() {
    if (inputType.toLocaleLowerCase() == 'guid') {
      return (
        <GuidInputField
          initialValue={initialValue}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          onValueChange={onValueChange}
          disabled={disabled}
          classNameBg={classNameBg}
          classNameHoverBg={classNameHoverBg}
          classNameHoverBgDark={classNameHoverBgDark}
          styleType={styleType}
        ></GuidInputField>
      )
    }
    if (inputType.toLocaleLowerCase() == 'bool' || inputType.toLocaleLowerCase() == 'boolean') {
      return (
        <BoolInputField
          initialValue={initialValue}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          onValueChange={onValueChange}
          disabled={disabled}
          classNameBg={classNameBg}
          classNameHoverBg={classNameHoverBg}
          classNameHoverBgDark={classNameHoverBgDark}
          styleType={styleType}
        ></BoolInputField>
      )
    }
    if (allowedValues) {
      return (
        <DropdownSelect
          disabled={disabled}
          classNameBg={classNameBg}
          classNameHoverBg={classNameHoverBg}
          classNameHoverBgDark={classNameHoverBgDark}
          styleType={styleType}
          options={Object.keys(allowedValues).map((av) => {
            return { label: allowedValues[av], value: av }
          })}
          onOptionSet={(o) => {
            setCurrentValue(o?.value)
            onValueChange(o?.value)
          }}
          initialOption={{ label: allowedValues[initialValue], value: initialValue }}
        ></DropdownSelect>
      )
    }
    if (EntitySchemaService.getHtmlInputType(inputType) == 'text' && multiLine) {
      return (
        <textarea
          rows={4}
          disabled={disabled}
          className={classNameInput}
          value={currentValue}
          onChange={(e) => {
            onValueChange(e.target.value)
            setCurrentValue(e.target.value)
          }}
        ></textarea>
      )
    }
    return (
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
        styleType={styleType}
      ></InputStyle>
    )
  }

  return (
    <div className={`w-full ${false ? 'flex justify-between gap-2 items-baseline ' : ''}`}>
      {label && (
        <label className='block mb-2 text-xs font-medium whitespace-nowrap align-baseline'>
          {label}
        </label>
      )}
      <div className='w-full'>{renderInnerInput()}</div>
    </div>
  )
}

export default InputField
export function getInputStyleClassName(
  styleType: number,
  classNameBg: string | undefined,
  disabled: boolean,
  classNameHoverBg: string | undefined,
  classNameHoverBgDark: string | undefined,
): string {
  return `text-sm rounded-sm p-3 outline-none block w-full transition-all
        ${
          styleType == 0
            ? 'border-b-2 border-bg7 dark:border-bg7dark focus:border-prim4 focus:dark:border-prim6'
            : 'border-2 border-bg7 dark:border-bg7dark focus:border-prim4 focus:dark:border-prim6'
        }          
        ${classNameBg || 'bg-bg3 dark:bg-bg3dark'}
        ${
          disabled
            ? ''
            : `
           hover:${classNameHoverBg || 'bg-bg5'}
           dark:hover:${classNameHoverBgDark || 'bg-bg5dark'}`
        }
        `
}
